import './CommunicationPanel.css';
import { Wifi, Radio, Cloud, Clock } from 'lucide-react';

interface Props {
  networkStatus: boolean;
  lastSyncTime: string;
}

export default function CommunicationPanel({ networkStatus, lastSyncTime }: Props) {
  return (
    <div className={`comm-panel ${networkStatus ? 'online' : 'offline'}`}>
      <div className="comm-header">
        <Wifi size={16} className={networkStatus ? 'text-green' : 'text-red'} />
        <span>Hardware IoT Connectivity</span>
      </div>

      <div className="comm-grid">
        <div className="comm-item">
          <div className="comm-item-header">
            <Wifi size={14} />
            <span>Wi-Fi (Primary)</span>
          </div>
          <span className={`comm-badge ${networkStatus ? 'badge-online' : 'badge-offline'}`}>
            {networkStatus ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>

        <div className="comm-item">
          <div className="comm-item-header">
            <Radio size={14} />
            <span>LoRa Backup</span>
          </div>
          <span className="comm-badge badge-online">AVAILABLE</span>
        </div>

        <div className="comm-item">
          <div className="comm-item-header">
            <Cloud size={14} />
            <span>Cloud Server</span>
          </div>
          <span className={`comm-badge ${networkStatus ? 'badge-online' : 'badge-offline'}`}>
            {networkStatus ? 'CONNECTED' : 'PAUSED'}
          </span>
        </div>

        <div className="comm-item">
          <div className="comm-item-header">
            <Clock size={14} />
            <span>Last Sync</span>
          </div>
          <span className="comm-time">{lastSyncTime || 'Pending...'}</span>
        </div>
      </div>
    </div>
  );
}
