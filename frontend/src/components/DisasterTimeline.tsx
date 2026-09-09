import type { SystemState } from '../App';
import './DisasterTimeline.css';
import { ShieldCheck, AlertOctagon, CheckCircle2, Play, RefreshCw, Activity } from 'lucide-react';

interface Props {
  state: SystemState;
  onRunDemo: (mode: 'normal' | 'flood' | 'recovery') => void;
}

export default function DisasterTimeline({ state, onRunDemo }: Props) {
  const currentStatus = state.system_status;

  // Determine current timeline stage
  let activeStage: 'BEFORE' | 'DURING' | 'AFTER' = 'BEFORE';
  if (currentStatus === 'CRITICAL' || currentStatus === 'WARNING') {
    activeStage = 'DURING';
  } else if (currentStatus === 'RECOVERY') {
    activeStage = 'AFTER';
  } else {
    activeStage = 'BEFORE';
  }

  return (
    <div className="disaster-timeline-container">
      <div className="timeline-header">
        <div className="timeline-title">
          <Activity size={20} className="icon-cyan" />
          <span>Three-Stage Disaster Management Timeline</span>
        </div>
        <div className="demo-controls">
          <button 
            className="demo-btn btn-normal"
            onClick={() => onRunDemo('normal')}
          >
            <RefreshCw size={14} /> SIMULATE NORMAL
          </button>
          <button 
            className="demo-btn btn-flood"
            onClick={() => onRunDemo('flood')}
          >
            <Play size={14} /> SIMULATE FLOOD
          </button>
          <button 
            className="demo-btn btn-recovery"
            onClick={() => onRunDemo('recovery')}
          >
            <CheckCircle2 size={14} /> SIMULATE RECOVERY
          </button>
        </div>
      </div>

      {/* 3-Stage Process Stepper */}
      <div className="timeline-stepper">
        
        {/* Stage 1: BEFORE DISASTER */}
        <div className={`timeline-stage ${activeStage === 'BEFORE' ? 'active-stage stage-before' : 'inactive-stage'}`}>
          <div className="stage-badge">
            <span className="stage-num">01</span>
            <span className="stage-name">BEFORE DISASTER</span>
          </div>
          <div className="stage-checklist">
            <div className="check-item"><CheckCircle2 size={12} className="check-icon" /> Rainfall Monitoring</div>
            <div className="check-item"><CheckCircle2 size={12} className="check-icon" /> Water Level Tracking</div>
            <div className="check-item"><CheckCircle2 size={12} className="check-icon" /> Drainage Flow Sensors</div>
            <div className="check-item"><CheckCircle2 size={12} className="check-icon" /> Early Warning Engine</div>
            <div className="check-item"><CheckCircle2 size={12} className="check-icon" /> Risk Assessment</div>
            <div className="check-item"><CheckCircle2 size={12} className="check-icon" /> System Readiness</div>
          </div>
        </div>

        <div className="stage-connector">➔</div>

        {/* Stage 2: DURING DISASTER */}
        <div className={`timeline-stage ${activeStage === 'DURING' ? 'active-stage stage-during' : 'inactive-stage'}`}>
          <div className="stage-badge">
            <span className="stage-num">02</span>
            <span className="stage-name">DURING DISASTER</span>
          </div>
          <div className="stage-checklist">
            <div className="check-item"><AlertOctagon size={12} className="check-icon" /> Flood Surge Detection</div>
            <div className="check-item"><AlertOctagon size={12} className="check-icon" /> Electrical Hazard Cutoff</div>
            <div className="check-item"><AlertOctagon size={12} className="check-icon" /> Manhole Grate Barrier</div>
            <div className="check-item"><AlertOctagon size={12} className="check-icon" /> Diversion Gate Open</div>
            <div className="check-item"><AlertOctagon size={12} className="check-icon" /> Storage Tank Level</div>
            <div className="check-item"><AlertOctagon size={12} className="check-icon" /> Siren & Emergency Alert</div>
          </div>
        </div>

        <div className="stage-connector">➔</div>

        {/* Stage 3: AFTER DISASTER */}
        <div className={`timeline-stage ${activeStage === 'AFTER' ? 'active-stage stage-after' : 'inactive-stage'}`}>
          <div className="stage-badge">
            <span className="stage-num">03</span>
            <span className="stage-name">AFTER DISASTER</span>
          </div>
          <div className="stage-checklist">
            <div className="check-item"><ShieldCheck size={12} className="check-icon" /> Water-Level Reduction</div>
            <div className="check-item"><ShieldCheck size={12} className="check-icon" /> Drainage Recovery Check</div>
            <div className="check-item"><ShieldCheck size={12} className="check-icon" /> Electrical Safety Verification</div>
            <div className="check-item"><ShieldCheck size={12} className="check-icon" /> Manhole Inspection Status</div>
            <div className="check-item"><ShieldCheck size={12} className="check-icon" /> Pump Safe Emptying</div>
            <div className="check-item"><ShieldCheck size={12} className="check-icon" /> Gate Reset & Event Report</div>
          </div>
        </div>

      </div>
    </div>
  );
}
