import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* ─── Sub-pages ───────────────────────────────────────────── */

function Dashboard({ requests }) {
  const total     = requests.length;
  const critical  = requests.filter(r => ['critical','high'].includes(r.urgency_level?.toLowerCase())).length;
  const name      = localStorage.getItem('name') || 'Donor';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(255,75,75,0.15), rgba(102,252,241,0.08))', borderColor: 'var(--accent-red)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Welcome back, {name.split(' ')[0]} 🩸</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your donations save lives. Here's today's snapshot.</p>
      </div>

      {/* Stat Cards */}
      <div className="metrics-ribbon">
        <div className="metric-card">
          <span className="metric-title">Active Requests</span>
          <span className="metric-value">{total}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>In your area</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Critical / High</span>
          <span className="metric-value" style={{ color: 'var(--accent-red)' }}>{critical}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Needs urgent action</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">My Donations</span>
          <span className="metric-value" style={{ color: 'var(--accent-blue)' }}>0</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>All time</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Next Eligible</span>
          <span className="metric-value" style={{ fontSize: '1.2rem' }}>Now ✅</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>You're ready to donate</span>
        </div>
      </div>

      {/* Quick Tip */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderColor: 'rgba(102,252,241,0.3)' }}>
        <p style={{ color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '0.4rem' }}>💡 Did you know?</p>
        <p style={{ color: 'var(--text-secondary)' }}>A single whole blood donation can save up to <strong style={{ color: 'white' }}>3 lives</strong>. Donors can give every 56 days.</p>
      </div>
    </div>
  );
}

function RequestsFeed({ requests, loading }) {
  const [donatedIds, setDonatedIds] = useState([]);

  const getUrgencyBadge = (level) => {
    const l = level?.toLowerCase();
    if (l === 'critical' || l === 'high') return <span className="badge badge-danger">🔴 Critical</span>;
    if (l === 'low') return <span className="badge badge-success">🟢 Low</span>;
    return <span className="badge badge-warning">🟠 Medium</span>;
  };

  const handleDonate = (id) => {
    setDonatedIds(prev => [...prev, id]);
    alert("Donation accepted! The hospital has been notified and will contact you shortly.");
  };

  if (loading) return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '2rem' }}>
      <div className="loader"></div><span>Scanning hospital network...</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dash-header" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
        <h2>🚨 Live Blood Requests</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Emergency requests matching your profile.</p>
      </div>
      {requests.length === 0 && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', padding: '2rem 0' }}>No active requests right now. Your area is stable. ✅</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {requests.map((req, i) => {
          const donated = donatedIds.includes(req._id || i);
          return (
            <div key={i} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1.5rem', opacity: donated ? 0.5 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.2rem' }}>Patient {(req.patient_name || 'Anonymous')[0].toUpperCase()}.</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{req.patient_age} yrs • {req.patient_gender} • {req.disease || 'Unknown Condition'}</p>
                </div>
                {getUrgencyBadge(req.urgency_level)}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Blood Type</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>{req.blood_group_required}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Units</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{req.units_needed}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--accent-blue)' }}>📍 {req.hospital_name || 'Central Hospital'} — {req.location || 'Unknown location'}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Required by: {req.required_date || 'ASAP'}</p>
              <button
                className="submit-btn"
                onClick={() => handleDonate(req._id || i)}
                disabled={donated}
                style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
              >
                {donated ? '✅ Committed' : '👉 I Want to Donate'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MyDonations() {
  const donations = []; // Will be populated from backend in future

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dash-header" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
        <h2>📜 My Donation History</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track every life you've helped save.</p>
      </div>
      {donations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩸</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No donations recorded yet.</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Head to <strong style={{ color: 'var(--accent-blue)' }}>Requests</strong> to make your first life-saving donation!</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Hospital</th>
                <th>Blood Type</th>
                <th>Units</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d, i) => (
                <tr key={i}>
                  <td>{d.date}</td>
                  <td>{d.hospital}</td>
                  <td style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>{d.blood_type}</td>
                  <td>{d.units}</td>
                  <td><span className="badge badge-success">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Notifications() {
  const notifications = [
    { icon: '🚨', title: 'Critical Request Nearby', body: 'A hospital 3km away needs O- urgently.', time: 'Just now', type: 'danger' },
    { icon: '✅', title: 'Eligibility Restored', body: "You're now eligible to donate again. 56 days have passed.", time: '2 hours ago', type: 'success' },
    { icon: '📢', title: 'Blood Drive Event', body: 'Community blood drive at City Hall on April 10th.', time: '1 day ago', type: 'info' },
  ];

  const borderColor = { danger: 'var(--accent-red)', success: 'var(--accent-blue)', info: '#ffc107' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dash-header" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
        <h2>🔔 Notifications</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Alerts, updates, and reminders for you.</p>
      </div>
      {notifications.map((n, i) => (
        <div key={i} className="glass-panel" style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start', padding: '1.2rem 1.5rem', borderLeftColor: borderColor[n.type], borderLeftWidth: '3px', borderLeftStyle: 'solid' }}>
          <span style={{ fontSize: '1.8rem' }}>{n.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, color: 'white', marginBottom: '0.2rem' }}>{n.title}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{n.body}</p>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{n.time}</span>
        </div>
      ))}
    </div>
  );
}

function Profile() {
  const name  = localStorage.getItem('name')  || 'Donor User';
  const email = localStorage.getItem('email') || 'Not set';
  const role  = localStorage.getItem('role')  || 'donor';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
      <div className="dash-header" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
        <h2>👤 My Profile</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your donor account details.</p>
      </div>

      {/* Avatar */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-red), #cc0000)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 700, color: 'white', flexShrink: 0
        }}>
          {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'white' }}>{name}</p>
          <p style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{role}</p>
        </div>
      </div>

      {/* Info */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
        {[
          { label: 'Full Name',  value: name  },
          { label: 'Email',      value: email },
          { label: 'Role',       value: role  },
          { label: 'Blood Type', value: 'Not set — update your profile' },
          { label: 'Location',   value: 'Not set' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</span>
            <span style={{ color: 'white', fontSize: '0.9rem' }}>{value}</span>
          </div>
        ))}
      </div>

      <button className="submit-btn" style={{ alignSelf: 'flex-start' }} onClick={() => alert('Profile editing coming soon!')}>
        ✏️ Edit Profile
      </button>
    </div>
  );
}

/* ─── Main DonorPortal ──────────────────────────────────── */

export default function DonorPortal() {
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const tab = new URLSearchParams(location.search).get('tab') || 'dashboard';

  useEffect(() => {
    fetch('http://localhost:8000/requests/active')
      .then(r => r.ok ? r.json() : [])
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const renderTab = () => {
    switch (tab) {
      case 'dashboard':     return <Dashboard requests={requests} />;
      case 'requests':      return <RequestsFeed requests={requests} loading={loading} />;
      case 'donations':     return <MyDonations />;
      case 'notifications': return <Notifications />;
      case 'profile':       return <Profile />;
      default:              return <Dashboard requests={requests} />;
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '1200px' }}>
      {renderTab()}
    </div>
  );
}
