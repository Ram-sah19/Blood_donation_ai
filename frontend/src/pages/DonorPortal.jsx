export default function DonorPortal() {
  return (
    <div className="portal-container" style={{width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
      <div className="glass-panel">
        <div className="header">
          <h2>Donor Dashboard</h2>
          <p>Welcome back! Status: <span style={{color: 'var(--accent-blue)', fontWeight: 'bold'}}>Available</span></p>
        </div>
        
        <div style={{marginTop: '2rem'}}>
          <h3 style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Emergency Alerts Near You</h3>
          <div className="result-card" style={{borderLeft: '4px solid var(--accent-red)'}}>
            <span className="result-label" style={{color: 'var(--accent-red)'}}>URGENT - High Priority</span>
            <span className="result-value">2 Units of O+ Needed</span>
            <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Patient in Chennai needs blood urgently for a surgery.</p>
            <button className="submit-btn" style={{marginTop: '1rem', alignSelf: 'flex-start', padding: '0.8rem 1.5rem'}}>
              Accept Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
