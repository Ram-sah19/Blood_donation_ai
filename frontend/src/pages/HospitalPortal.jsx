import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* ─── Shared fetch helper ─────────────────────────────────── */
const API = 'http://localhost:8000';

/* ─── Dashboard Tab ──────────────────────────────────────── */
function HospitalDashboard({ requests }) {
  const name  = localStorage.getItem('name') || 'Hospital';
  const total    = requests.length;
  const critical = requests.filter(r => ['critical','high'].includes(r.urgency_level?.toLowerCase())).length;
  const medium   = requests.filter(r => r.urgency_level?.toLowerCase() === 'medium').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(102,252,241,0.1), rgba(255,75,75,0.08))', borderColor: 'rgba(102,252,241,0.3)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Welcome, {name.split(' ')[0]} 🏥</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage blood requests and coordinate with donors in real-time.</p>
      </div>

      {/* Stats */}
      <div className="metrics-ribbon">
        {[
          { label: 'Active Requests',  value: total,    color: 'var(--accent-blue)' },
          { label: 'Critical / High',  value: critical, color: 'var(--accent-red)'  },
          { label: 'Medium Priority',  value: medium,   color: '#ffc107'            },
          { label: 'Donors Notified',  value: total * 3, color: 'var(--accent-blue)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="metric-card">
            <span className="metric-title">{label}</span>
            <span className="metric-value" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Quick tip */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderColor: 'rgba(102,252,241,0.2)' }}>
        <p style={{ color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '0.4rem' }}>💡 Tip</p>
        <p style={{ color: 'var(--text-secondary)' }}>Use <strong style={{ color: 'white' }}>➕ New Request</strong> and paste doctor notes — Gemini AI will auto-extract everything for you.</p>
      </div>
    </div>
  );
}

/* ─── New Request Tab ─────────────────────────────────────── */
function NewRequest({ onRequestCreated }) {
  const [rawNotes, setRawNotes]   = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [formData, setFormData]   = useState({
    patient_name: '', patient_age: '', patient_gender: '', disease: '',
    blood_group_required: '', units_needed: '', urgency_level: 'Medium',
    required_date: '', notes: '',
    hospital_name: localStorage.getItem('name') || 'General Hospital',
    location: 'Local Region',
  });

  const handleAutoFill = async () => {
    if (!rawNotes.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/requests/parse-nlp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawNotes }),
      });
      if (res.ok) {
        const ai = await res.json();
        setFormData(prev => ({ ...prev, ...ai }));
        setRawNotes('');
      } else {
        alert('AI extraction failed. Fill the form manually.');
      }
    } catch { alert('Could not reach backend.'); }
    finally { setAiLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/requests/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, patient_age: parseInt(formData.patient_age) || 0, units_needed: parseInt(formData.units_needed) || 0 }),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ patient_name:'', patient_age:'', patient_gender:'', disease:'', blood_group_required:'', units_needed:'', urgency_level:'Medium', required_date:'', notes:'', hospital_name: localStorage.getItem('name') || 'General Hospital', location:'Local Region' });
        onRequestCreated?.();
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert('Submission failed.');
      }
    } catch (err) { alert('Error: ' + err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dash-header" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
        <h2>➕ New Blood Request</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Submit a new emergency blood request for a patient.</p>
      </div>

      {success && (
        <div className="glass-panel" style={{ padding: '1.2rem', borderColor: 'var(--accent-blue)', background: 'rgba(102,252,241,0.08)', color: 'var(--accent-blue)', textAlign: 'center', fontWeight: 600 }}>
          ✅ Request submitted! Donors in your area are being notified.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px,1fr) 1.5fr', gap: '2rem' }}>
        {/* AI Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem' }}>🤖 AI Auto-Fill</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Paste raw doctor notes and let Gemini extract the data instantly.</p>
          <textarea
            value={rawNotes}
            onChange={e => setRawNotes(e.target.value)}
            placeholder={"e.g. \"Patient needs 2 units of O- urgently for surgery in Chennai\""}
            style={{ minHeight: '120px' }}
          />
          <button className="submit-btn" onClick={handleAutoFill} disabled={aiLoading}
            style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-blue)', color: '#000' }}>
            {aiLoading ? '🤖 Extracting...' : '✨ Magic Extract via Gemini'}
          </button>
        </div>

        {/* Manual Form */}
        <div className="glass-panel">
          <h3 style={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem', marginBottom: '1.2rem' }}>📝 Request Form</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="auth-input" type="text"   name="patient_name"  placeholder="Patient Name"  value={formData.patient_name}  onChange={e => setFormData({...formData, patient_name: e.target.value})}  required />
              <input className="auth-input" type="number" name="patient_age"   placeholder="Age"           value={formData.patient_age}   onChange={e => setFormData({...formData, patient_age: e.target.value})}   required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <select className="auth-input" value={formData.patient_gender} onChange={e => setFormData({...formData, patient_gender: e.target.value})} required>
                <option value="">Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input className="auth-input" type="text" placeholder="Blood Group (e.g. O-)" value={formData.blood_group_required} onChange={e => setFormData({...formData, blood_group_required: e.target.value})} required />
            </div>
            <input className="auth-input" type="text" placeholder="Disease / Reason (e.g. Surgery)" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="auth-input" type="number" placeholder="Units Needed" value={formData.units_needed} onChange={e => setFormData({...formData, units_needed: e.target.value})} required />
              <select className="auth-input" value={formData.urgency_level} onChange={e => setFormData({...formData, urgency_level: e.target.value})}>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟠 Medium</option>
                <option value="Critical">🔴 Critical</option>
              </select>
            </div>
            <input className="auth-input" type="date" value={formData.required_date} onChange={e => setFormData({...formData, required_date: e.target.value})} />
            <textarea className="auth-input" placeholder="Additional Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} style={{ minHeight: '70px' }} />
            <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Routing to Network...' : '🚀 Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Active Requests Tab ────────────────────────────────── */
function ActiveRequests({ requests, loading, onRefresh }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="dash-header" style={{ textAlign: 'left', marginBottom: 0 }}>
          <h2>🩺 Active Requests</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Live blood requests from your hospital.</p>
        </div>
        <button className="submit-btn" onClick={onRefresh} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '2rem' }}>
          <div className="loader" /><span>Loading requests...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</p>
          <p style={{ color: 'var(--text-secondary)' }}>No active requests right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '0.2rem' }}>{req.patient_name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{req.patient_age} yrs • {req.patient_gender} • {req.disease || 'N/A'}</p>
                </div>
                <span className={`badge ${req.urgency_level?.toLowerCase() === 'critical' ? 'badge-danger' : req.urgency_level?.toLowerCase() === 'low' ? 'badge-success' : 'badge-warning'}`}>
                  {req.urgency_level}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', background: 'rgba(0,0,0,0.3)', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Blood Type</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>{req.blood_group_required}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Units</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>{req.units_needed}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Required By</p>
                  <p style={{ fontSize: '1rem', color: 'white', marginTop: '0.3rem' }}>{req.required_date || 'ASAP'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="auth-input" style={{ flex: 1, padding: '0.5rem', textAlign: 'center', background: 'rgba(102,252,241,0.08)', color: 'var(--accent-blue)', cursor: 'pointer' }}>
                  👥 View Matched Donors (0)
                </button>
                <button className="auth-input" style={{ width: '100px', padding: '0.5rem', textAlign: 'center', borderColor: 'var(--accent-red)', color: 'var(--accent-red)', cursor: 'pointer' }}
                  onClick={() => alert('Close request — coming soon!')}>
                  Close
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── History Tab ─────────────────────────────────────────── */
function History() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="dash-header" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
        <h2>📋 Request History</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Past blood requests from your hospital.</p>
      </div>
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No completed requests yet.</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Completed requests will appear here.</p>
      </div>
    </div>
  );
}

/* ─── Profile Tab ─────────────────────────────────────────── */
function HospitalProfile() {
  const name  = localStorage.getItem('name')  || 'Hospital';
  const email = localStorage.getItem('email') || 'Not set';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
      <div className="dash-header" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
        <h2>👤 Hospital Profile</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your hospital account details.</p>
      </div>
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), #006f6b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 700, color: '#000', flexShrink: 0,
        }}>
          🏥
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'white' }}>{name}</p>
          <p style={{ color: 'var(--accent-blue)', fontSize: '0.9rem' }}>Hospital Staff</p>
        </div>
      </div>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
        {[
          { label: 'Hospital Name', value: name  },
          { label: 'Email',         value: email },
          { label: 'Role',          value: 'hospital' },
          { label: 'Location',      value: 'Local Region' },
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

/* ─── Main HospitalPortal ─────────────────────────────────── */
export default function HospitalPortal() {
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  const tab = new URLSearchParams(location.search).get('tab') || 'dashboard';

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/requests/active`);
      const data = await res.json();
      if (res.ok) setRequests(Array.isArray(data) ? data : []);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const renderTab = () => {
    switch (tab) {
      case 'dashboard': return <HospitalDashboard requests={requests} />;
      case 'new':       return <NewRequest onRequestCreated={fetchRequests} />;
      case 'active':    return <ActiveRequests requests={requests} loading={loading} onRefresh={fetchRequests} />;
      case 'history':   return <History />;
      case 'profile':   return <HospitalProfile />;
      default:          return <HospitalDashboard requests={requests} />;
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '1200px' }}>
      {renderTab()}
    </div>
  );
}
