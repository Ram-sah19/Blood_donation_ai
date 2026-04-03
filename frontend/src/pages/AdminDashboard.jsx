export default function AdminDashboard() {
  return (
    <div className="portal-container" style={{width: '100%', maxWidth: '800px'}}>
      <div className="glass-panel">
        <div className="header">
          <h2>System Administration</h2>
          <p>Overview of network activity</p>
        </div>
        
        <div className="results-grid">
          <div className="result-card">
            <span className="result-label">Active Hospitals</span>
            <span className="result-value">12</span>
          </div>
          <div className="result-card">
            <span className="result-label">Registered Donors</span>
            <span className="result-value">340</span>
          </div>
          <div className="result-card">
            <span className="result-label">Live Requests</span>
            <span className="result-value" style={{color: 'var(--accent-red)'}}>3</span>
          </div>
        </div>
      </div>
    </div>
  )
}
