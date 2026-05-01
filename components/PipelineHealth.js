import { useState, useEffect } from 'react';

export default function PipelineHealth() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/pipeline-status')
        .then(res => res.json())
        .then(json => setStatus(json))
        .catch(err => console.error(err));
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="glass-card health-container">Loading...</div>;

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
          <span className="stat-label">Last Run</span>
          <span className="stat-value">{new Date(status.last_run_time).toLocaleTimeString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Rows Ingested</span>
          <span className="stat-value">{status.rows_ingested.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
