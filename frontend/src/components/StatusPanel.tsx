import type { SystemState } from '../App';
import './StatusPanel.css';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  state: SystemState;
}

export default function StatusPanel({ state }: Props) {
  return (
    <div className="status-panel">
      <h2><Cpu size={18} /> Actuator & System Status</h2>

      <div className="status-item">
        <span>System Mode</span>
        <span className={`status-val mode-${state.system_status.toLowerCase()}`}>{state.system_status}</span>
      </div>

      <div className="status-item">
        <span>Diversion Gate</span>
        <span className={`status-val ${state.gate_status ? 'active' : 'inactive'}`}>
          {state.gate_status ? 'OPEN' : 'CLOSED'}
        </span>
      </div>

      <div className="status-item">
        <span>Water Release Pump</span>
        <span className={`status-val ${state.pump_status ? 'active' : 'inactive'}`}>
          {state.pump_status ? 'RUNNING' : 'OFF'}
        </span>
      </div>

      <div className="status-item">
        <span>Temporary Storage</span>
        <span className="status-val">{state.storage_level.toFixed(0)}%</span>
      </div>

      <div className="status-item">
        <span>Local Control Edge</span>
        <span className="status-val active"><ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> ESP32 ACTIVE</span>
      </div>
    </div>
  );
}
