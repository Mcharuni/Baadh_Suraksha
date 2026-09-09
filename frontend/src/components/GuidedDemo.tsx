import { useState, useEffect, useRef } from 'react';
import type { SystemState } from '../App';
import './GuidedDemo.css';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Tv, CheckCircle2, ShieldCheck, WifiOff, AlertTriangle } from 'lucide-react';

interface Props {
  onUpdateState: (updates: Partial<SystemState>) => void;
}

export interface SceneConfig {
  id: number;
  title: string;
  subtitle: string;
  actionText: string;
  durationSeconds: number;
  updates: Partial<SystemState>;
}

export const DEMO_SCENES: SceneConfig[] = [
  {
    id: 1,
    title: "SCENE 1 — NORMAL CITY",
    subtitle: "Baseline urban monitoring under clear weather conditions.",
    actionText: "Sensors operating normally | All systems standby | Green status",
    durationSeconds: 6,
    updates: {
      rainfall_intensity: 0,
      zone1_water_level: 5, zone2_water_level: 5, zone3_water_level: 5,
      zone1_flow: 10, zone2_flow: 10, zone3_flow: 10,
      electrical_hazard: false, manhole_displacement: false, debris_blockage: false,
      emergency_status: false, network_status: true, main_power_status: true, solar_active: true
    }
  },
  {
    id: 2,
    title: "SCENE 2 — RAINFALL BEGINS",
    subtitle: "Precipitation commences; rain sensors detect initial accumulation.",
    actionText: "Rainfall: 35 mm/h | Water levels accumulating | Flow rising",
    durationSeconds: 6,
    updates: {
      rainfall_intensity: 35,
      zone1_water_level: 25, zone2_water_level: 22, zone3_water_level: 18,
      zone1_flow: 25, zone2_flow: 25, zone3_flow: 25
    }
  },
  {
    id: 3,
    title: "SCENE 3 — FLOOD WARNING",
    subtitle: "Water levels cross 50 cm warning threshold. ESP32 issues early alert.",
    actionText: "State: WARNING | Yellow alert engaged | Telemetry dispatched",
    durationSeconds: 6,
    updates: {
      rainfall_intensity: 55,
      zone1_water_level: 55, zone2_water_level: 52, zone3_water_level: 48,
      zone1_flow: 35, zone2_flow: 35, zone3_flow: 35
    }
  },
  {
    id: 4,
    title: "SCENE 4 — CRITICAL FLOOD & BLOCKAGE",
    subtitle: "Severe rain surge; upstream water rises while drainage flow drops.",
    actionText: "State: CRITICAL | Debris Blockage Suspected | High water surge",
    durationSeconds: 6,
    updates: {
      rainfall_intensity: 85,
      zone1_water_level: 82, zone2_water_level: 85, zone3_water_level: 80,
      zone1_flow: 12, zone2_flow: 15, zone3_flow: 14,
      debris_blockage: true
    }
  },
  {
    id: 5,
    title: "SCENE 5 — EMERGENCY RESPONSE & HAZARDS",
    subtitle: "Critical flood threshold breached; electrical hazard & manhole displacement detected.",
    actionText: "Siren Active | HV Line Isolated | Motorized Safety Barrier Deployed",
    durationSeconds: 7,
    updates: {
      rainfall_intensity: 95,
      zone1_water_level: 92, zone2_water_level: 95, zone3_water_level: 90,
      electrical_hazard: true, manhole_displacement: true, emergency_status: true
    }
  },
  {
    id: 6,
    title: "SCENE 6 — WATER DIVERSION",
    subtitle: "Local ESP32 triggers Servo Diversion Gate to redirect flood surplus.",
    actionText: "Diversion Gate OPEN | Water path redirected ➔ Storage Tank Filling",
    durationSeconds: 6,
    updates: {
      rainfall_intensity: 80,
      zone1_water_level: 85, zone2_water_level: 88, zone3_water_level: 82,
      electrical_hazard: false, manhole_displacement: false
    }
  },
  {
    id: 7,
    title: "SCENE 7 — PUMPING TO SECONDARY DRAIN",
    subtitle: "Storage tank reaches threshold; water release pump activates.",
    actionText: "Pump ON | Water transferred to secondary drain | Storage level decreasing",
    durationSeconds: 6,
    updates: {
      rainfall_intensity: 50,
      zone1_water_level: 60, zone2_water_level: 65, zone3_water_level: 58,
      safe_to_release: true
    }
  },
  {
    id: 8,
    title: "SCENE 8 — NETWORK FAILURE (AUTONOMOUS EDGE)",
    subtitle: "Primary Wi-Fi disconnects; ESP32 continues autonomous local safety control.",
    actionText: "Wi-Fi DISCONNECTED | Edge Control Active | Local Safety Uninterrupted",
    durationSeconds: 7,
    updates: {
      network_status: false
    }
  },
  {
    id: 9,
    title: "SCENE 9 — RECOVERY PHASE",
    subtitle: "Rainfall subsides; water levels fall below safe recovery limits.",
    actionText: "Wi-Fi Restored | Rain Stopping | Gate & Pump Resetting | Siren OFF",
    durationSeconds: 6,
    updates: {
      rainfall_intensity: 10,
      zone1_water_level: 25, zone2_water_level: 20, zone3_water_level: 18,
      zone1_flow: 20, zone2_flow: 20, zone3_flow: 20,
      electrical_hazard: false, manhole_displacement: false, debris_blockage: false,
      emergency_status: false, network_status: true
    }
  },
  {
    id: 10,
    title: "SCENE 10 — SYSTEM NORMAL & EVENT REPORT",
    subtitle: "All water cleared; system returns to normal baseline monitoring.",
    actionText: "State: NORMAL | All Actuators Standby | Event Summary Report Logged",
    durationSeconds: 6,
    updates: {
      rainfall_intensity: 0,
      zone1_water_level: 5, zone2_water_level: 5, zone3_water_level: 5,
      zone1_flow: 10, zone2_flow: 10, zone3_flow: 10
    }
  }
];

export default function GuidedDemo({ onUpdateState }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const scene = DEMO_SCENES[currentSceneIdx];

  // Execute state updates when scene changes or starts
  useEffect(() => {
    if (isPlaying) {
      onUpdateState(scene.updates);
      setProgress(0);
    }
  }, [currentSceneIdx, isPlaying]);

  // Timer loop for scene stepping and progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100;
    const totalMs = scene.durationSeconds * 1000;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (intervalMs / totalMs) * 100;
        if (next >= 100) {
          if (currentSceneIdx < DEMO_SCENES.length - 1) {
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
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePauseResume = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setCurrentSceneIdx(0);
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
    if (currentSceneIdx < DEMO_SCENES.length - 1) {
      setCurrentSceneIdx((idx) => idx + 1);
      setProgress(0);
    }
  };

  return (
    <div className={`guided-demo-bar ${isPlaying ? 'demo-active' : ''}`}>
      <div className="demo-left">
        <div className="demo-badge">
          <Tv size={16} className="icon-pulse" />
          <span>GUIDED DEMO MODE</span>
        </div>

        <div className="demo-buttons">
          {!isPlaying && currentSceneIdx === 0 ? (
            <button className="btn-demo-primary" onClick={handleStart}>
              <Play size={14} /> START DEMO
            </button>
          ) : (
            <button className="btn-demo-secondary" onClick={handlePauseResume}>
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'PAUSE' : 'RESUME'}
            </button>
          )}

          <button className="btn-demo-icon" onClick={handleRestart} title="Restart Demo">
            <RotateCcw size={14} />
          </button>
          <button className="btn-demo-icon" onClick={handlePrev} disabled={currentSceneIdx === 0} title="Previous Scene">
            <SkipBack size={14} />
          </button>
          <button className="btn-demo-icon" onClick={handleNext} disabled={currentSceneIdx === DEMO_SCENES.length - 1} title="Next Scene">
            <SkipForward size={14} />
          </button>
        </div>
      </div>

      {/* Narrator Banner */}
      <div className="demo-narrator">
        <div className="scene-title-row">
          <span className="scene-number">SCENE {scene.id} / 10</span>
          <span className="scene-title-text">{scene.title}</span>
        </div>
        <div className="scene-subtitle">{scene.subtitle}</div>
        <div className="scene-action-tag">⚡ {scene.actionText}</div>
        
        <div className="scene-progress-outer">
          <div className="scene-progress-inner" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
