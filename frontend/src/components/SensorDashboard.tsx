import type { SystemState } from '../App';
import './SensorDashboard.css';
import { CloudRain, Droplets, Wind, Battery, Zap, AlertTriangle, Disc, AlertOctagon } from 'lucide-react';

interface Props {
  state: SystemState;
}

export default function SensorDashboard({ state }: Props) {
  const avgWaterLevel = ((state.zone1_water_level + state.zone2_water_level + state.zone3_water_level) / 3).toFixed(1);
  const totalFlow = (state.zone1_flow + state.zone2_flow + state.zone3_flow).toFixed(1);

  return (
    <div className="sensor-dashboard">
      <h2 className="dashboard-title">Sensor Telemetry Grid</h2>
      
      <div className="telemetry-grid">
        <div className="telemetry-card">
          <div className="card-top">
            <CloudRain className="card-icon text-cyan" size={18} />
            <span className="card-label">Rainfall</span>
          </div>
          <div className="card-val">{state.rainfall_intensity.toFixed(1)} <span className="unit">mm/h</span></div>
        </div>

        <div className="telemetry-card">
          <div className="card-top">
            <Droplets className="card-icon text-blue" size={18} />
            <span className="card-label">Avg Water Level</span>
          </div>
          <div className="card-val">{avgWaterLevel} <span className="unit">cm</span></div>
        </div>

        <div className="telemetry-card">
          <div className="card-top">
            <Wind className="card-icon text-emerald" size={18} />
            <span className="card-label">Total Drainage Flow</span>
          </div>
          <div className="card-val">{totalFlow} <span className="unit">L/s</span></div>
        </div>

        <div className="telemetry-card">
          <div className="card-top">
            <Battery className="card-icon text-purple" size={18} />
            <span className="card-label">LiFePO4 Battery</span>
          </div>
          <div className="card-val">{state.battery_status.toFixed(0)}%</div>
        </div>
      </div>

      <div className="fault-status-grid">
        <div className={`fault-card ${state.electrical_hazard ? 'active-hazard' : ''}`}>
          <Zap size={16} />
          <span>Electrical Hazard</span>
          <span className="badge">{state.electrical_hazard ? 'DETECTED' : 'SAFE'}</span>
        </div>

        <div className={`fault-card ${state.manhole_displacement ? 'active-hazard' : ''}`}>
          <Disc size={16} />
          <span>Manhole Safety</span>
          <span className="badge">{state.manhole_displacement ? 'DISPLACED' : 'SECURE'}</span>
        </div>

        <div className={`fault-card ${state.debris_blockage || state.blockage_suspected ? 'active-warning' : ''}`}>
          <AlertOctagon size={16} />
          <span>Drain Blockage</span>
          <span className="badge">{state.debris_blockage || state.blockage_suspected ? 'SUSPECTED' : 'CLEAR'}</span>
        </div>

        <div className={`fault-card ${!state.main_power_status ? 'active-warning' : ''}`}>
          <AlertTriangle size={16} />
          <span>Power Source</span>
          <span className="badge">{state.main_power_status ? 'AC GRID' : 'BATTERY'}</span>
        </div>
      </div>
    </div>
  );
}
