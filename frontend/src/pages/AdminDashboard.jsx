import { useState, useEffect } from 'react';
import { Users, Activity, Droplet, Archive } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ hospitals: 0, donors: 0, live_requests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/stats');
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Dummy Stock Levels
  const stockLevels = [
    { group: 'O+', units: 450, status: 'stable' },
    { group: 'O-', units: 12, status: 'critical' },
    { group: 'A+', units: 320, status: 'stable' },
    { group: 'A-', units: 45, status: 'warning' },
    { group: 'B+', units: 210, status: 'stable' },
    { group: 'AB+', units: 89, status: 'stable' },
  ];

  return (
    <div className="app-container" style={{maxWidth: '1200px'}}>
      <div className="dash-header" style={{textAlign: 'left'}}>
        <h1>Network Command Center</h1>
        <p>Global system overview, user management, and blood inventory tracking.</p>
      </div>

      <div className="metrics-ribbon">
        <div className="metric-card">
          <span className="metric-title" style={{display: 'flex', alignItems: 'center', gap:'0.5rem'}}><Users size={16}/> Registered Donors</span>
          <span className="metric-value">{stats.donors}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title" style={{display: 'flex', alignItems: 'center', gap:'0.5rem'}}><Activity size={16}/> Active Network Requests</span>
          <span className="metric-value" style={{color: 'var(--accent-red)'}}>{stats.live_requests}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title" style={{display: 'flex', alignItems: 'center', gap:'0.5rem'}}><Archive size={16}/> Partnered Hospitals</span>
          <span className="metric-value" style={{color: 'white'}}>{stats.hospitals}</span>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem'}}>
        
        {/* Left Col: Stock Tracking */}
        <div className="glass-panel">
          <h3 style={{color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Droplet color="var(--accent-red)" size={20}/> Global Blood Inventory</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {stockLevels.map(s => (
               <div key={s.group} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px'}}>
                  <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'white', width: '50px'}}>{s.group}</span>
                  
                  <div style={{flex: 1, margin: '0 1rem', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'}}>
                     <div style={{
                       width: `${Math.min((s.units / 500) * 100, 100)}%`, 
                       height: '100%', 
                       background: s.status === 'critical' ? 'var(--accent-red)' : s.status === 'warning' ? '#ffc107' : 'var(--accent-blue)'
                     }}></div>
                  </div>

                  <div style={{textAlign: 'right', width: '80px'}}>
                    <span style={{display: 'block', color: 'white', fontWeight: 'bold'}}>{s.units} U</span>
                    <span style={{fontSize: '0.7rem', color: s.status === 'critical' ? 'var(--accent-red)' : 'var(--text-secondary)', textTransform: 'uppercase'}}>{s.status}</span>
                  </div>
               </div>
            ))}
          </div>
        </div>

        {/* Right Col: Management Modules */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          <div className="glass-panel" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}>
             <div style={{textAlign: 'center'}}>
               <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Patient & Donor Management Module</h3>
               <p style={{color: 'var(--text-secondary)', marginBottom: '1rem'}}>Full ERP features for individual user tracking.</p>
               <button className="submit-btn" style={{margin: '0 auto'}}>Launch User Directory</button>
             </div>
          </div>

          <div className="glass-panel" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}>
             <div style={{textAlign: 'center'}}>
               <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Network Overrides</h3>
               <p style={{color: 'var(--text-secondary)', marginBottom: '1rem'}}>Force-close requests or trigger emergency broadcasts.</p>
               <button className="submit-btn" style={{margin: '0 auto', background: 'transparent', border: '1px solid var(--accent-red)'}}>Emergency Broadcast System</button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
