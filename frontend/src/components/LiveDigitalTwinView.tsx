import { useState, useEffect, useRef } from 'react';
import type { SystemState } from '../App';
import './LiveDigitalTwinView.css';
import { 
  Play, Pause, RotateCcw, SkipBack, SkipForward, FastForward, 
  ArrowLeft, Cpu, Activity, Droplets, Zap, ShieldCheck, 
  AlertOctagon, Volume2, Sun, Battery, CloudRain, CheckCircle2 
} from 'lucide-react';

interface Props {
  state: SystemState;
  onUpdateState: (updates: Partial<SystemState>) => void;
  onBackToDashboard: () => void;
}

export interface TwinScene {
  id: number;
  title: string;
  subtitle: string;
  durationSeconds: number;
  cameraFocus: 'full' | 'road' | 'sensors' | 'esp32' | 'manhole' | 'gate' | 'tank' | 'pump';
  updates: Partial<SystemState>;
}

export const TWIN_SCENES: TwinScene[] = [
  {
    id: 1,
    title: "SCENE 1 — NORMAL CITY CONDITION",
    subtitle: "Dry urban roadway, clear drainage, all safety actuators idle, green LED status.",
    durationSeconds: 6,
    cameraFocus: 'road',
    updates: {
      rainfall_intensity: 0,
      zone1_water_level: 5, zone2_water_level: 5, zone3_water_level: 5,
      zone1_flow: 10, zone2_flow: 10, zone3_flow: 10,
      electrical_hazard: false, manhole_displacement: false, debris_blockage: false,
      emergency_status: false, network_status: true, main_power_status: true,
      solar_active: true, gate_status: false, pump_status: false, storage_level: 0
    }
  },
  {
    id: 2,
    title: "SCENE 2 — RAIN BEGINS",
    subtitle: "Cloud condensation begins; tipping bucket rain gauge registers precipitation.",
    durationSeconds: 6,
    cameraFocus: 'road',
    updates: {
      rainfall_intensity: 30,
      zone1_water_level: 18, zone2_water_level: 15, zone3_water_level: 12,
      zone1_flow: 25, zone2_flow: 25, zone3_flow: 25
    }
  },
  {
    id: 3,
    title: "SCENE 3 — WATER ACCUMULATION",
    subtitle: "Rainwater accumulates on road surface; ultrasonic sensors project laser scanning beams.",
    durationSeconds: 7,
    cameraFocus: 'sensors',
    updates: {
      rainfall_intensity: 50,
      zone1_water_level: 42, zone2_water_level: 38, zone3_water_level: 35,
      zone1_flow: 38, zone2_flow: 38, zone3_flow: 38
    }
  },
  {
    id: 4,
    title: "SCENE 4 — WARNING STATE",
    subtitle: "Water level crosses 50 cm threshold; ESP32 receives sensor signals & activates Yellow LED.",
    durationSeconds: 6,
    cameraFocus: 'esp32',
    updates: {
      rainfall_intensity: 65,
      zone1_water_level: 58, zone2_water_level: 54, zone3_water_level: 52,
      zone1_flow: 45, zone2_flow: 45, zone3_flow: 45
    }
  },
  {
    id: 5,
    title: "SCENE 5 — CRITICAL FLOOD & HAZARDS",
    subtitle: "Heavy rain surge; Red LED flashes, acoustic siren activates, electrical hazard isolated.",
    durationSeconds: 7,
    cameraFocus: 'road',
    updates: {
      rainfall_intensity: 95,
      zone1_water_level: 92, zone2_water_level: 90, zone3_water_level: 88,
      electrical_hazard: true, manhole_displacement: true, emergency_status: true
    }
  },
  {
    id: 6,
    title: "SCENE 6 — MECHANICAL MANHOLE SAFETY",
    subtitle: "ESP32 signals servo actuator ➔ mechanical arm rotates ➔ safety barrier slides over manhole.",
    durationSeconds: 7,
    cameraFocus: 'manhole',
    updates: {
      rainfall_intensity: 90,
      zone1_water_level: 88, zone2_water_level: 86, zone3_water_level: 84
    }
  },
  {
    id: 7,
    title: "SCENE 7 — SERVO DIVERSION GATE OPENS",
    subtitle: "Servo motor rotates diversion gate open; main channel floodwater changes direction.",
    durationSeconds: 7,
    cameraFocus: 'gate',
    updates: {
      gate_status: true,
      rainfall_intensity: 80,
      zone1_water_level: 82
    }
  },
  {
    id: 8,
    title: "SCENE 8 — UNDERGROUND TEMPORARY STORAGE",
    subtitle: "Diverted floodwater streams into storage tank; tank level rises 20% ➔ 40% ➔ 60% ➔ 80%.",
    durationSeconds: 7,
    cameraFocus: 'tank',
    updates: {
      storage_level: 80,
      zone1_water_level: 68
    }
  },
  {
    id: 9,
    title: "SCENE 9 — PUMP ACTIVATION & WATER DISCHARGE",
    subtitle: "Submersible pump motor spins; water transfers to secondary drain ➔ tank level drains to 30%.",
    durationSeconds: 8,
    cameraFocus: 'pump',
    updates: {
      pump_status: true,
      safe_to_release: true,
      storage_level: 30,
      zone1_water_level: 45
    }
  },
  {
    id: 10,
    title: "SCENE 10 — RECOVERY PHASE",
    subtitle: "Rain subsides, road water recedes; gate closes, manhole barrier retracts, siren stops.",
    durationSeconds: 7,
    cameraFocus: 'road',
    updates: {
      rainfall_intensity: 10,
      zone1_water_level: 20, zone2_water_level: 18, zone3_water_level: 15,
      electrical_hazard: false, manhole_displacement: false, debris_blockage: false,
      emergency_status: false, gate_status: false, pump_status: false, storage_level: 10
    }
  },
  {
    id: 11,
    title: "SCENE 11 — NORMAL SYSTEM OPERATION",
    subtitle: "All floodwater cleared; ESP32 resets to baseline standby monitoring. Green LED active.",
    durationSeconds: 6,
    cameraFocus: 'full',
    updates: {
      rainfall_intensity: 0,
      zone1_water_level: 5, zone2_water_level: 5, zone3_water_level: 5,
      zone1_flow: 10, zone2_flow: 10, zone3_flow: 10,
      storage_level: 0
    }
  }
];

export default function LiveDigitalTwinView({ state, onUpdateState, onBackToDashboard }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progress, setProgress] = useState(0);

  const scene = TWIN_SCENES[currentSceneIdx];
  const totalDuration = TWIN_SCENES.reduce((acc, s) => acc + s.durationSeconds, 0);

  // Execute state updates when scene changes or starts
  useEffect(() => {
    if (isPlaying) {
      onUpdateState(scene.updates);
      setProgress(0);
    }
  }, [currentSceneIdx, isPlaying]);

  // Stepping timer & playback engine
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100;
    const totalMs = scene.durationSeconds * 1000;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + intervalMs / 1000);
      setProgress((prev) => {
        const next = prev + (intervalMs / totalMs) * 100;
        if (next >= 100) {
          if (currentSceneIdx < TWIN_SCENES.length - 1) {
            setCurrentSceneIdx((idx) => idx + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIdx, scene.durationSeconds]);

  const handleStart = () => {
    setCurrentSceneIdx(0);
    setElapsedSeconds(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePauseResume = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setCurrentSceneIdx(0);
    setElapsedSeconds(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx((idx) => idx - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentSceneIdx < TWIN_SCENES.length - 1) {
      setCurrentSceneIdx((idx) => idx + 1);
      setProgress(0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine LED status bloom
  const isCritical = state.system_status === 'CRITICAL';
  const isWarning = state.system_status === 'WARNING';
  const isNormal = state.system_status === 'NORMAL' || state.system_status === 'RECOVERY';

  return (
    <div className="digital-twin-container">
      
      {/* Top Header & Navigation Bar */}
      <div className="twin-top-nav">
        <button className="btn-back-dashboard" onClick={onBackToDashboard}>
          <ArrowLeft size={16} /> ← BACK TO DASHBOARD
        </button>

        <div className="twin-title">
          <Activity size={20} className="icon-cyan-pulse" />
          <span>🎬 LIVE HARDWARE DIGITAL TWIN SIMULATION</span>
        </div>

        <div className="twin-scene-pill">
          SCENE {scene.id} / 11
        </div>
      </div>

      {/* Cinematic Scene Banner Overlay */}
      <div className="cinematic-banner">
        <div className="scene-header">
          <span className="scene-tag">{scene.title}</span>
          <div className="led-status-group">
            <span className={`led-light led-green ${isNormal ? 'active' : ''}`}></span>
            <span className={`led-light led-yellow ${isWarning ? 'active' : ''}`}></span>
            <span className={`led-light led-red ${isCritical ? 'active' : ''}`}></span>
          </div>
        </div>
        <div className="scene-subtitle-text">{scene.subtitle}</div>
      </div>

      {/* 2.5D Cutaway Digital Twin Canvas */}
      <div className={`twin-canvas focus-${scene.cameraFocus}`}>
        
        {/* Layer 1: Sky & Rain Weather Engine */}
        <div className="sky-layer">
          <div className="cloud-group">
            {state.rainfall_intensity > 20 && <div className="dark-cloud cloud-1">☁</div>}
            {state.rainfall_intensity > 50 && <div className="dark-cloud cloud-2">🌧</div>}
            {state.rainfall_intensity > 80 && <div className="dark-cloud cloud-3">⛈</div>}
          </div>
          {state.rainfall_intensity > 0 && (
            <div className="rain-particles" style={{ opacity: Math.min(1, state.rainfall_intensity / 60) }}></div>
          )}
        </div>

        {/* Layer 2: Urban Road Surface & Rising Floodwater */}
        <div className="road-cutaway">
          <div className="road-surface-label">URBAN ROADWAY SURFACE</div>
          <div 
            className="floodwater-volume" 
            style={{ height: `${Math.min(100, state.zone1_water_level * 0.9)}%` }}
          >
            <div className="water-surface-wave"></div>
          </div>
        </div>

        {/* Layer 3: Laser Sensors & Scanning Beams */}
        <div className="sensors-layer">
          <div className="sensor-node rain-gauge-node">
            <CloudRain size={16} className="sensor-icon" />
            <span>Rain Gauge ({state.rainfall_intensity.toFixed(0)} mm/h)</span>
          </div>

          <div className="sensor-node level-laser-node">
            <Droplets size={16} className="sensor-icon" />
            <span>Ultrasonic Level ({state.zone1_water_level.toFixed(0)} cm)</span>
            <div className="laser-beam"></div>
          </div>

          <div className="sensor-node hazard-node">
            <Zap size={16} className={`sensor-icon ${state.electrical_hazard ? 'hazard-active' : ''}`} />
            <span>HV Electrical Hazard ({state.electrical_hazard ? 'ISOLATED' : 'SAFE'})</span>
          </div>
        </div>

        {/* Layer 4: Wiring Grid & Glowing ESP32 Data Signals */}
        <div className="wiring-grid">
          {isPlaying && (
            <div className="data-packet-stream">
              <span className="packet packet-1"></span>
              <span className="packet packet-2"></span>
              <span className="packet packet-3"></span>
            </div>
          )}
          <div className="esp32-mcu-box">
            <Cpu size={24} className="mcu-icon" />
            <div className="mcu-label">ESP32 EDGE CONTROLLER</div>
            <div className="mcu-state">{state.system_status}</div>
          </div>
        </div>

        {/* Layer 5: Mechanical Manhole Safety Barrier */}
        <div className="manhole-cutaway">
          <div className="manhole-title">MECHANICAL MANHOLE barrier</div>
          <div className={`manhole-cover-plate ${state.manhole_displacement ? 'displaced' : 'closed'}`}>
            MANHOLE GRATE
          </div>
          <div className={`mechanical-linkage-arm ${state.manhole_displacement ? 'rotated' : 'standby'}`}>
            <div className="servo-gear-joint">⚙</div>
            <div className="arm-lever"></div>
          </div>
          <div className={`protective-barrier-grate ${state.manhole_displacement ? 'deployed' : 'retracted'}`}>
            <ShieldCheck size={16} />
            <span>DESTRUCTIVE SAFETY BARRIER DEPLOYED</span>
          </div>
        </div>

        {/* Layer 6: Main Drainage Channel & Servo Diversion Gate */}
        <div className="channel-cutaway">
          <div className="channel-title">MAIN DRAINAGE CHANNEL</div>
          <div className="main-stream-pipe">
            <div className="streaming-water-particles" style={{ opacity: state.zone1_flow > 0 ? 0.9 : 0.2 }}></div>
          </div>

          <div className={`servo-gate-mechanism ${state.gate_status ? 'gate-open' : 'gate-closed'}`}>
            <div className="servo-motor-body">⚙ SERVO MOTOR</div>
            <div className="pivoting-gate-door">
              {state.gate_status ? 'DIVERSION GATE OPEN 90°' : 'GATE CLOSED'}
            </div>
          </div>
        </div>

        {/* Layer 7: Underground Storage Tank & Submersible Pump */}
        <div className="storage-cutaway">
          <div className="tank-title">UNDERGROUND TEMPORARY STORAGE TANK ({state.storage_level.toFixed(0)}%)</div>
          
          {state.gate_status && <div className="tank-inlet-stream"></div>}

          <div className="tank-water-fluid">
            <div 
              className={`liquid-volume ${state.storage_level >= 80 ? 'critical-high' : ''}`}
              style={{ height: `${state.storage_level}%` }}
            ></div>
          </div>

          <div className="pump-assembly">
            <div className={`pump-motor-impeller ${state.pump_status ? 'spinning' : 'idle'}`}>
              🌀 PUMP MOTOR (12V DC)
            </div>
            {state.pump_status && <div className="pump-outlet-discharge"></div>}
          </div>
        </div>

        {/* Layer 8: Warning Siren & Power Subsystem */}
        <div className="peripheral-layer">
          <div className={`siren-beacon ${state.emergency_status || isCritical ? 'siren-flashing' : ''}`}>
            <Volume2 size={20} />
            <span>110dB INDUSTRIAL SIREN</span>
          </div>

          <div className="power-node">
            <Sun size={16} className={state.solar_active ? 'text-amber' : ''} />
            <Battery size={16} className="text-emerald" />
            <span>SOLAR MPPT + LiFePO4 ({state.battery_status.toFixed(0)}%)</span>
          </div>
        </div>

      </div>

      {/* Video Transport Controls Bar */}
      <div className="twin-video-controls">
        <div className="transport-left">
          {!isPlaying && currentSceneIdx === 0 ? (
            <button className="btn-play-hero" onClick={handleStart}>
              <Play size={16} /> ▶ START SIMULATION
            </button>
          ) : (
            <button className="btn-play-toggle" onClick={handlePauseResume}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'PAUSE' : 'RESUME'}
            </button>
          )}

          <button className="btn-ctrl-icon" onClick={handleRestart} title="Restart Simulation">
            <RotateCcw size={16} />
          </button>
          <button className="btn-ctrl-icon" onClick={handlePrev} disabled={currentSceneIdx === 0} title="Previous Scene">
            <SkipBack size={16} />
          </button>
          <button className="btn-ctrl-icon" onClick={handleNext} disabled={currentSceneIdx === TWIN_SCENES.length - 1} title="Next Scene">
            <SkipForward size={16} />
          </button>
        </div>

        <div className="transport-center">
          <div className="video-time-display">
            <span>Time: {formatTime(elapsedSeconds)}</span>
            <span className="divider">|</span>
            <span>Scene: {scene.id} / 11</span>
          </div>
          <div className="video-progress-track">
            <div className="video-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

    </div>
  );
}
