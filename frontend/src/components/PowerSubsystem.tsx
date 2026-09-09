import type { SystemState } from '../App';
import './PowerSubsystem.css';
import { Sun, SunDim, Zap, ZapOff, Battery, BatteryCharging, BatteryWarning, Cpu, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  state: SystemState;
}

export default function PowerSubsystem({ state }: Props) {
  const isMainPower = state.main_power_status;
  const isSolar = state.solar_active;
  const battLevel = Math.round(state.battery_status);
  const isDead = battLevel <= 0 && !isMainPower;

  const powerSourceLabel = isMainPower ? "POWER SOURCE: MAIN" : "POWER SOURCE: BATTERY BACKUP";

  const activeLoads = [];
  if (!isDead) activeLoads.push("ESP32 Microcontroller");
  if (!isDead) activeLoads.push("Sensors (Water/Flow/Elec)");
  if (!isDead && state.gate_status) activeLoads.push("Motorized Gate Servo (High Load)");
  if (!isDead && state.pump_status) activeLoads.push("Water Pump Actuator (Critical Load)");

  let battColorClass = 'high';
  if (battLevel < 20) battColorClass = 'critical';
  else if (battLevel < 50) battColorClass = 'warning';

  return (
    <div className={`power-subsystem ${isMainPower ? 'grid-online' : 'grid-offline'}`}>
      <div className="power-header">
        <div className="power-title">
          <Zap className="power-icon" size={20} />
          <h3>Power Subsystem Architecture</h3>
        </div>
        <div className={`power-badge ${isMainPower ? 'badge-main' : 'badge-battery'}`}>
          {powerSourceLabel}
        </div>
      </div>

      {isDead && (
        <div className="system-dead-banner">
          <AlertTriangle size={18} />
          <span>CRITICAL FAILURE: SYSTEM SHUTDOWN (BATTERY EXHAUSTED)</span>
        </div>
      )}

      {!isMainPower && !isDead && (
        <div className="power-warning-banner">
          <AlertTriangle size={16} />
          <span>MAIN POWER FAILURE — RUNNING ON LOCAL BATTERY BACKUP</span>
        </div>
      )}

      {/* Visual Power Flow Grid */}
      <div className="power-flow-grid">
        
        {/* Node 1: Solar Panel */}
        <div className={`flow-card ${isSolar ? 'active' : 'inactive'}`}>
          <div className="card-header">
            {isSolar ? <Sun className="icon solar-icon glowing" size={22} /> : <SunDim className="icon solar-icon dimmed" size={22} />}
            <span className="card-title">Solar Panel</span>
          </div>
          <div className="card-body">
            <div className="metric">{isSolar ? "18.5V / 4.2A" : "0.0V (Night)"}</div>
            <div className="status-sub">{isSolar ? "GENERATING POWER" : "SOLAR INACTIVE"}</div>
          </div>
        </div>

        {/* Node 2: Charge Controller */}
        <div className="flow-card active controller-card">
          <div className="card-header">
            <Cpu className="icon controller-icon" size={22} />
            <span className="card-title">MPPT Controller</span>
          </div>
          <div className="card-body">
            <div className="metric">
              {isMainPower ? "GRID PRIORITY" : (isSolar ? "SOLAR CHARGE" : "DISCHARGING")}
            </div>
            <div className="status-sub">Smart Power Path</div>
          </div>
        </div>

        {/* Node 3: Battery Storage */}
        <div className={`flow-card battery-card ${battColorClass}`}>
          <div className="card-header">
            {isMainPower || isSolar ? (
              <BatteryCharging className="icon batt-icon charging" size={22} />
            ) : battLevel < 20 ? (
              <BatteryWarning className="icon batt-icon warning-icon" size={22} />
            ) : (
              <Battery className="icon batt-icon" size={22} />
            )}
            <span className="card-title">LiFePO4 Battery</span>
          </div>
          <div className="card-body">
            <div className="battery-val-container">
              <span className="metric">{battLevel}%</span>
              <span className="batt-rate">
                {isMainPower ? "+5.0%/s (AC)" : isSolar ? "+0.5%/s (Solar)" : `- ${state.pump_status ? '3.0' : '1.0'}%/s`}
              </span>
            </div>
            <div className="battery-bar-outer">
              <div 
                className={`battery-bar-inner ${battColorClass}`} 
                style={{ width: `${Math.max(0, Math.min(100, battLevel))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Node 4: Load / ESP32 */}
        <div className={`flow-card load-card ${isDead ? 'dead' : 'running'}`}>
          <div className="card-header">
            {isMainPower ? <Zap className="icon load-icon" size={22} /> : <ZapOff className="icon load-icon" size={22} />}
            <span className="card-title">Power Management</span>
          </div>
          <div className="card-body">
            <div className="status-sub">
              {isDead ? (
                <span className="text-red">SYSTEM UNPOWERED</span>
              ) : (
                <span className="text-green"><ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> ESSENTIAL LOADS ACTIVE</span>
              )}
            </div>
            <div className="load-list">
              {activeLoads.map((load, idx) => (
                <div key={idx} className="load-item">⚡ {load}</div>
              ))}
              {isDead && <div className="load-item text-red">❌ All Actuators & Sensors Offline</div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
