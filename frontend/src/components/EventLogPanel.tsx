import type { SystemState } from '../App';
import './EventLogPanel.css';
import { History } from 'lucide-react';

interface Props {
  state: SystemState;
}

export default function EventLogPanel({ state }: Props) {
  return (
    <div className="event-log-panel">
      <h2><History size={16} /> Edge Hardware Logs</h2>
      <div className="log-list">
        {state.logs.length === 0 ? (
          <div className="empty-log">No logs recorded yet.</div>
        ) : (
          state.logs.map((log, index) => (
            <div key={index} className="log-item">
              <span className="log-time">[{log.time}]</span>
              <span className="log-msg">{log.msg}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
