import type { SystemState } from '../App';
import './StateFlow.css';

interface Props {
  state: SystemState;
}

export default function StateFlow({ state }: Props) {
  const current = state.system_status;

  return (
    <div className="state-flow">
      <h3>Local Decision State Machine</h3>
      <div className="flow-nodes">
        <div className={`node ${current === 'NORMAL' ? 'active normal' : ''}`}>NORMAL</div>
        <div className="arrow">➔</div>
        <div className={`node ${current === 'WARNING' ? 'active warning' : ''}`}>WARNING</div>
        <div className="arrow">➔</div>
        <div className={`node ${current === 'CRITICAL' ? 'active critical' : ''}`}>CRITICAL</div>
        <div className="arrow">➔</div>
        <div className={`node ${current === 'RECOVERY' ? 'active recovery' : ''}`}>RECOVERY</div>
      </div>
    </div>
  );
}
