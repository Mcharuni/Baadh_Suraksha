import type { SystemState } from '../App';
import './CloudDashboard.css';
import { Cloud, WifiOff, ShieldCheck, Activity, Battery, Zap, AlertTriangle } from 'lucide-react';

interface Props {
  state: SystemState;
  networkStatus: boolean;
}

export default function CloudDashboard({ state, networkStatus }: Props) {
  return (
    <div className="cloud-dashboard">
      <div className="cloud-header">
        <div className="cloud-title">
          <Cloud className="icon" size={24} />
          <div>
            <h2>FloodShield Cloud Monitoring Portal</h2>
            <p>Remote Telemetry & Operations Command</p>
          </div>
        </div>
        <div className={`network-badge ${networkStatus ? 'online' : 'offline'}`}>
          {networkStatus ? 'LIVE TELEMETRY SYNC' : 'OFFLINE - CACHED DATA'}
        </div>
      </div>

      {!networkStatus && (
        <div className="network-warning-banner">
          <WifiOff size={20} />
          <div>
            <h3>NETWORK DISCONNECTED — EDGE RUNNING AUTONOMOUSLY</h3>
            <p>ESP32 Local edge safety controller continues local decision-making and emergency response.</p>
          </div>
        </div>
      )}

      <div className="cloud-grid">
        <div className="cloud-card">
          <div className="card-label">Zone Status</div>
          <div className={`card-val status-${state.system_status.toLowerCase()}`}>{state.system_status}</div>
        </div>

        <div className="cloud-card">
          <div className="card-label">Rainfall Intensity</div>
          <div className="card-val">{state.rainfall_intensity.toFixed(1)} mm/h</div>
        </div>

        <div className="cloud-card">
          <div className="card-label">Avg Water Level</div>
          <div className="card-val">
            {((state.zone1_water_level + state.zone2_water_level + state.zone3_water_level) / 3).toFixed(1)} cm
          </div>
        </div>

        <div className="cloud-card">
          <div className="card-label">Diversion Gate</div>
          <div className="card-val">{state.gate_status ? 'OPEN' : 'CLOSED'}</div>
        </div>

        <div className="cloud-card">
          <div className="card-label">Water Pump</div>
          <div className="card-val">{state.pump_status ? 'ON' : 'OFF'}</div>
        </div>

        <div className="cloud-card">
          <div className="card-label">Storage Tank Level</div>
          <div className="card-val">{state.storage_level.toFixed(0)}%</div>
        </div>

        <div className="cloud-card">
          <div className="card-label">Electrical Hazard</div>
          <div className="card-val">{state.electrical_hazard ? 'DETECTED' : 'NORMAL'}</div>
        </div>

        <div className="cloud-card">
          <div className="card-label">LiFePO4 Battery</div>
          <div className="card-val">{state.battery_status.toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
}
