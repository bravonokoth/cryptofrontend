import { useState, useEffect } from 'react';
import { Zap, Clock, Database } from 'lucide-react';

export default function PipelineHealth() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/pipeline-status')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then(json => setStatus(json))
        .catch(err => { setStatus({ error: true }); });
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="glass-card health-container"><div className="loading-card">Checking status…</div></div>;
  if (status.error) return (
    <div className="glass-card health-container">
      <h2>Pipeline Status</h2>
      <div className="error-text">Status unavailable</div>
    </div>
  );

  const isHealthy = status.status === 'healthy';

  return (
    <div className="glass-card health-container">
      <h2>Pipeline Status</h2>
      <div className="status-indicator">
        <div className={`pulse-ring ${isHealthy ? 'healthy' : 'error'}`}></div>
        <div className={`status-dot ${isHealthy ? 'healthy' : 'error'}`}></div>
        <span className="status-text">{isHealthy ? 'Operational' : 'Issues Detected'}</span>
      </div>

      <div className="health-stats">
        <div className="stat">
          <span className="stat-label"><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />Last Check</span>
          <span className="stat-value">{new Date(status.last_run_time).toLocaleTimeString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label"><Zap size={12} style={{ display: 'inline', marginRight: 4 }} />Latency</span>
          <span className="stat-value">{status.latency_ms ?? '—'}ms</span>
        </div>
        <div className="stat">
          <span className="stat-label"><Database size={12} style={{ display: 'inline', marginRight: 4 }} />Source</span>
          <span className="stat-value" style={{ textTransform: 'capitalize' }}>{status.source ?? 'DB'}</span>
        </div>
      </div>

      {status.note && (
        <p className="pipeline-note">{status.note}</p>
      )}
    </div>
  );
}
