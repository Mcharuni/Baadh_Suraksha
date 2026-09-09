import type { SystemState } from '../App';
import './ControlPanel.css';
import { SlidersHorizontal } from 'lucide-react';

interface Props {
  state: SystemState;
  onUpdate: (updates: Partial<SystemState>) => void;
}

export default function ControlPanel({ state, onUpdate }: Props) {
  const handleSlider = (key: keyof SystemState, value: string) => {
    onUpdate({ [key]: parseFloat(value) });
  };

  const handleToggle = (key: keyof SystemState, value: boolean) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="control-panel">
      <h2><SlidersHorizontal size={20} className="text-primary" /> Environment Controls</h2>

      <div className="control-group">
        <div className="control-label">
          <span>Rainfall Intensity</span>
          <span>{state.rainfall_intensity.toFixed(1)} mm/h</span>
        </div>
        <input 
          type="range" className="slider-input" min="0" max="100" step="1"
          value={state.rainfall_intensity} onChange={(e) => handleSlider('rainfall_intensity', e.target.value)}
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Zone 1 Water Level</span>
          <span>{state.zone1_water_level.toFixed(1)} cm</span>
        </div>
        <input 
          type="range" className="slider-input" min="0" max="100" step="1"
          value={state.zone1_water_level} onChange={(e) => handleSlider('zone1_water_level', e.target.value)}
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Zone 2 Water Level</span>
          <span>{state.zone2_water_level.toFixed(1)} cm</span>
        </div>
        <input 
          type="range" className="slider-input" min="0" max="100" step="1"
          value={state.zone2_water_level} onChange={(e) => handleSlider('zone2_water_level', e.target.value)}
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Zone 3 Water Level</span>
          <span>{state.zone3_water_level.toFixed(1)} cm</span>
        </div>
        <input 
          type="range" className="slider-input" min="0" max="100" step="1"
          value={state.zone3_water_level} onChange={(e) => handleSlider('zone3_water_level', e.target.value)}
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Zone 1 Flow</span>
          <span>{state.zone1_flow.toFixed(1)} L/s</span>
        </div>
        <input 
          type="range" className="slider-input" min="0" max="100" step="1"
          value={state.zone1_flow} onChange={(e) => handleSlider('zone1_flow', e.target.value)}
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Zone 2 Flow</span>
          <span>{state.zone2_flow.toFixed(1)} L/s</span>
        </div>
        <input 
          type="range" className="slider-input" min="0" max="100" step="1"
          value={state.zone2_flow} onChange={(e) => handleSlider('zone2_flow', e.target.value)}
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Zone 3 Flow</span>
          <span>{state.zone3_flow.toFixed(1)} L/s</span>
        </div>
        <input 
          type="range" className="slider-input" min="0" max="100" step="1"
          value={state.zone3_flow} onChange={(e) => handleSlider('zone3_flow', e.target.value)}
        />
      </div>

      <h2 style={{ marginTop: '0.5rem' }}>Hardware Faults & Events</h2>

      <div className="toggle-group">
        <span className="toggle-label">Electrical Hazard</span>
        <label className="switch">
          <input type="checkbox" checked={state.electrical_hazard} onChange={(e) => handleToggle('electrical_hazard', e.target.checked)} />
          <span className="slider danger"></span>
        </label>
      </div>

      <div className="toggle-group">
        <span className="toggle-label">Manhole Displacement</span>
        <label className="switch">
          <input type="checkbox" checked={state.manhole_displacement} onChange={(e) => handleToggle('manhole_displacement', e.target.checked)} />
          <span className="slider danger"></span>
        </label>
      </div>

      <div className="toggle-group">
        <span className="toggle-label">Debris Blockage</span>
        <label className="switch">
          <input type="checkbox" checked={state.debris_blockage} onChange={(e) => handleToggle('debris_blockage', e.target.checked)} />
          <span className="slider danger"></span>
        </label>
      </div>
      
      <div className="toggle-group">
        <span className="toggle-label">Network Connectivity</span>
        <label className="switch">
          <input type="checkbox" checked={state.network_status} onChange={(e) => handleToggle('network_status', e.target.checked)} />
          <span className="slider"></span>
        </label>
      </div>

      <div className="toggle-group">
        <span className="toggle-label">Main Power Supply</span>
        <label className="switch">
          <input type="checkbox" checked={state.main_power_status} onChange={(e) => handleToggle('main_power_status', e.target.checked)} />
          <span className="slider"></span>
        </label>
      </div>

      <div className="toggle-group">
        <span className="toggle-label">Solar Input (Day/Night)</span>
        <label className="switch">
          <input type="checkbox" checked={state.solar_active} onChange={(e) => handleToggle('solar_active', e.target.checked)} />
          <span className="slider"></span>
        </label>
      </div>

      <h2 style={{ marginTop: '0.5rem' }}>Downstream Conditions</h2>
      <div className="toggle-group">
        <span className="toggle-label">Secondary Drain Safe</span>
        <label className="switch">
          <input type="checkbox" checked={state.safe_to_release} onChange={(e) => handleToggle('safe_to_release', e.target.checked)} />
          <span className="slider"></span>
        </label>
      </div>

      <button 
        className={`emergency-btn ${state.emergency_status ? 'active' : ''}`}
        onClick={() => handleToggle('emergency_status', !state.emergency_status)}
      >
        {state.emergency_status ? 'Emergency Active - Click to Reset' : 'Trigger Emergency'}
      </button>

    </div>
  );
}
