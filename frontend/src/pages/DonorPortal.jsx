import { useState, useEffect } from 'react';

export default function DonorPortal() {
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:8000/requests/active');
      const data = await res.json();
      if (res.ok) setActiveRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "Anon";
    return name.split(" ").map(n => n[0]).join('').toUpperCase();
  };

  const getUrgencyBadge = (level) => {
    const l = level?.toLowerCase();
    if (l === 'critical' || l === 'high') return <span className="badge badge-danger">🔴 Critical</span>;
    if (l === 'low') return <span className="badge badge-success">🟢 Low</span>;
    return <span className="badge badge-warning">🟠 Medium</span>;
  };

  const handleDonate = (id) => {
    alert("Donation accepted! The hospital has been notified and will contact you shortly.");
    // In future, POST to /requests/accept/:id
  };

  return (
    <div className="app-container" style={{maxWidth: '1200px'}}>
      <div className="dash-header" style={{textAlign: 'left'}}>
        <h1>Donor Feed</h1>
        <p>Live active emergency requests matching your donor profile.</p>
      </div>

      {loading ? (
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
           <div className="loader"></div> <span>Scanning hospital network...</span>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem'}}>
          {activeRequests.map((req, i) => (
            <div key={i} className="glass-panel" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem'}}>
              
              {/* Header */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h3 style={{fontSize: '1.4rem', marginBottom: '0.2rem', color: 'white'}}>Patient {getInitials(req.patient_name)}</h3>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>{req.patient_age} yrs • {req.patient_gender} • {req.disease || 'Unknown Condition'}</p>
                </div>
                {getUrgencyBadge(req.urgency_level)}
              </div>

              {/* Blood Needs */}
              <div style={{background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase'}}>Requirement</p>
                  <p style={{fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-red)'}}>{req.blood_group_required}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                   <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase'}}>Units</p>
                   <p style={{fontSize: '1.3rem', fontWeight: 'bold', color: 'white'}}>{req.units_needed}</p>
                </div>
              </div>

              {/* Hospital Needs */}
              <div>
                <p style={{fontSize: '0.9rem', color: 'var(--accent-blue)'}}>📍 {req.hospital_name || 'Central Hospital'} — {req.location || 'Unknown location'}</p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Target Date: {req.required_date || 'ASAP'}</p>
              </div>

              {/* Action */}
              <button className="submit-btn" onClick={() => handleDonate(req._id)} style={{width: '100%', justifyContent: 'center', marginTop: 'auto'}}>
                👉 I Want to Donate
              </button>

            </div>
          ))}

          {activeRequests.length === 0 && (
            <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>No active blood requests right now. Your area is stable.</p>
          )}
        </div>
      )}
    </div>
  );
}
