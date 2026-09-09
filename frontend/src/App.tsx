import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import SimulationView from './components/SimulationView';
import ControlPanel from './components/ControlPanel';
import StatusPanel from './components/StatusPanel';
import SensorDashboard from './components/SensorDashboard';
import StateFlow from './components/StateFlow';
import EventLogPanel from './components/EventLogPanel';
import CommunicationPanel from './components/CommunicationPanel';
import CloudDashboard from './components/CloudDashboard';
import PowerSubsystem from './components/PowerSubsystem';
import DisasterTimeline from './components/DisasterTimeline';
import GuidedDemo from './components/GuidedDemo';
import { Activity } from 'lucide-react';

export interface SystemState {
  rainfall_intensity: number;
  zone1_water_level: number;
  zone2_water_level: number;
  zone3_water_level: number;
  zone1_flow: number;
  zone2_flow: number;
  zone3_flow: number;
  electrical_hazard: boolean;
  manhole_displacement: boolean;
  debris_blockage: boolean;
  blockage_suspected: boolean;
  emergency_status: boolean;
  network_status: boolean;
  main_power_status: boolean;
  solar_active: boolean;
  system_status: string;
  gate_status: boolean;
  pump_status: boolean;
  battery_status: number;
  storage_level: number;
  safe_to_release: boolean;
  logs: { time: string, msg: string }[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/state';
const DEMO_URL = API_URL.replace('/api/state', '/api/demo');

function App() {
  const [state, setState] = useState<SystemState | null>(null);
  const [cloudState, setCloudState] = useState<SystemState | null>(null);
  const [activeView, setActiveView] = useState<'simulation' | 'cloud'>('simulation');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  const fetchState = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setState(data);
      if (data.network_status) {
        setCloudState(data);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const updateState = async (updates: Partial<SystemState>) => {
    try {
      const res = await axios.post(API_URL, updates);
      setState(res.data);
    } catch (err) {
      console.error("Failed to update state", err);
    }
  };

  const runDemo = async (mode: 'normal' | 'flood' | 'recovery') => {
    try {
      const res = await axios.post(`${DEMO_URL}/${mode}`);
      setState(res.data);
      if (res.data.network_status) {
        setCloudState(res.data);
      }
    } catch (err) {
      console.error("Failed to run demo mode", err);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!state) {
    return <div style={{ color: 'white', padding: '2rem' }}>Initializing Hardware Interface...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="title-area">
          <Activity className="header-icon" />
          <h1>BAADH SURAKSHA <span>System Control</span></h1>
        </div>
        <div className="view-toggle">
          <button 
            className={activeView === 'simulation' ? 'active' : ''} 
            onClick={() => setActiveView('simulation')}
          >
            Hardware Simulation
          </button>
          <button 
            className={activeView === 'cloud' ? 'active' : ''} 
            onClick={() => setActiveView('cloud')}
          >
            FloodShield Cloud
          </button>
        </div>
      </header>

      <GuidedDemo onUpdateState={updateState} />
      <DisasterTimeline state={state} onRunDemo={runDemo} />

      <div className="main-layout">
        <div className="sensor-panel">
          <SensorDashboard state={state} />
          <PowerSubsystem state={state} />
        </div>
        <div className="simulation-panel">
          {activeView === 'simulation' ? (
            <SimulationView state={state} />
          ) : (
            cloudState && <CloudDashboard state={cloudState} networkStatus={state.network_status} />
          )}
        </div>
        <div className="side-panel">
          <CommunicationPanel networkStatus={state.network_status} lastSyncTime={lastSyncTime} />
          <StateFlow state={state} />
          <StatusPanel state={state} />
          <EventLogPanel state={state} />
          <ControlPanel state={state} onUpdate={updateState} />
        </div>
      </div>
    </div>
  );
}

export default App;
