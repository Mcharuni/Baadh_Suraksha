import type { SystemState } from '../App';
import './SimulationView.css';
import { AlertOctagon, Volume2, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  state: SystemState;
}

export default function SimulationView({ state }: Props) {
  const isCritical = state.system_status === 'CRITICAL';
  const isWarning = state.system_status === 'WARNING';
  const isDead = state.battery_status <= 0 && !state.main_power_status;

  return (
    <div className={`simulation-view ${isCritical ? 'status-critical' : isWarning ? 'status-warning' : ''}`}>
      <div className="sim-header">
        <div className="sim-title">
          <Cpu className="icon" size={20} />
          <span>3D Hardware Simulation & Waterflow Path</span>
        </div>
        <div className={`status-pill ${state.system_status.toLowerCase()}`}>
          {isDead ? 'SYSTEM UNPOWERED' : `SYSTEM STATUS: ${state.system_status}`}
        </div>
      </div>

      {state.electrical_hazard && (
        <div className="electrical-hazard-overlay">
          <AlertOctagon className="hazard-icon flashing" size={32} />
          <div>
            <h3>ELECTRICAL HAZARD DETECTED</h3>
            <p>SAFE ISOLATION RESPONSE ACTIVE — LOCAL POWER & HIGH VOLTAGE LINES DISCONNECTED</p>
          </div>
        </div>
      )}

      {isCritical && (
        <div className="siren-indicator active">
          <Volume2 className="siren-icon pulsing" size={24} />
          <span>LOCAL AUDIBLE WARNING SIREN ACTIVE</span>
        </div>
      )}

      {/* Dynamic Waterflow & Hardware Canvas */}
      <div className="isometric-canvas">
        
        {/* Road Surface & Rain FX */}
        <div className="road-surface">
          <div className="road-label">URBAN ROADWAY</div>
          {state.rainfall_intensity > 0 && (
            <div className="rain-animation" style={{ opacity: Math.min(1, state.rainfall_intensity / 50) }}></div>
          )}
          {state.zone1_water_level > 10 && (
            <div className="road-puddle" style={{ height: `${Math.min(100, state.zone1_water_level)}%` }}></div>
          )}
        </div>

        {/* Drainage Inlet & Motorized Manhole Barrier */}
        <div className="manhole-section">
          <div className="manhole-label">MANHOLE / DRAINAGE INLET</div>
          <div className={`manhole-cover ${state.manhole_displacement ? 'displaced' : 'secure'}`}>
            {state.manhole_displacement ? 'DISPLACED!' : 'MANHOLE COVER'}
          </div>
          
          <div className={`safety-barrier ${state.manhole_displacement ? 'deployed' : 'retracted'}`}>
            <ShieldAlert size={16} />
            <span>{state.manhole_displacement ? 'MOTORIZED SAFETY BARRIER DEPLOYED' : 'BARRIER STANDBY'}</span>
          </div>
        </div>

        {/* Main Drainage Channel & Waterflow */}
        <div className="channel-section">
          <div className="channel-label">MAIN DRAINAGE CHANNEL</div>
          <div className="channel-pipe">
            <div 
              className="water-flow-stream" 
              style={{ 
                height: `${Math.min(100, (state.zone1_water_level + state.zone2_water_level) / 2)}%`,
                opacity: state.zone1_flow > 0 ? 0.9 : 0.2
              }}
            >
              {state.zone1_flow > 0 && <div className="flow-arrows">➔ ➔ ➔ ➔ ➔</div>}
            </div>
          </div>
        </div>

        {/* Servo Diversion Gate */}
        <div className="gate-section">
          <div className="gate-label">SERVO DIVERSION GATE</div>
          <div className={`diversion-gate ${state.gate_status ? 'open' : 'closed'}`}>
            <div className="gate-door">{state.gate_status ? 'GATE OPEN (DIVERSIFYING)' : 'GATE CLOSED'}</div>
          </div>
        </div>

        {/* Diversion Channel to Storage Tank */}
        {state.gate_status && (
          <div className="diversion-stream active">
            <span className="arrow-down">⬇ EXCESS WATER DIVERSION ⬇</span>
          </div>
        )}

        {/* Temporary Storage Tank & Pump */}
        <div className="storage-tank-section">
          <div className="tank-header">
            <span>TEMPORARY STORAGE TANK</span>
            <span className="tank-pct">{state.storage_level.toFixed(0)}%</span>
          </div>
          
          <div className="tank-outer">
            <div 
              className={`tank-water ${state.storage_level >= 95 ? 'critical-full' : ''}`}
              style={{ height: `${state.storage_level}%` }}
            ></div>
          </div>

          <div className="pump-control-node">
            <div className={`pump-badge ${state.pump_status ? 'pump-on' : 'pump-off'}`}>
              PUMP: {state.pump_status ? 'ON (RELEASING WATER)' : 'OFF'}
            </div>
            {state.pump_status && <div className="secondary-release-stream">⬇ RELEASING TO SECONDARY DRAIN ⬇</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
