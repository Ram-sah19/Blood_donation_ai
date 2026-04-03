import { useState, useEffect } from 'react';

export default function HospitalPortal() {
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Auto-Fill Form State
  const [rawNotes, setRawNotes] = useState('');
  
  // Structured Form State
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    disease: '',
    blood_group_required: '',
    units_needed: '',
    urgency_level: 'Medium',
    required_date: '',
    notes: '',
    hospital_name: localStorage.getItem('name') || 'General Hospital',
    location: 'Local Region'
  });

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
    }
  };

  const handleAutoFill = async () => {
    if (!rawNotes.trim()) return;
    setAiLoading(true);
    try {
      const response = await fetch('http://localhost:8000/requests/parse-nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawNotes })
      });
      if (response.ok) {
        const aiData = await response.json();
        setFormData(prev => ({
          ...prev,
          ...aiData,
          patient_age: aiData.patient_age || prev.patient_age,
          units_needed: aiData.units_needed || prev.units_needed
        }));
        setRawNotes('');
      } else {
        alert("Failed to parse via AI.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           ...formData,
           patient_age: parseInt(formData.patient_age) || 0,
           units_needed: parseInt(formData.units_needed) || 0
        }),
      });

      if (response.ok) {
        setFormData({
          patient_name: '', patient_age: '', patient_gender: '', disease: '',
          blood_group_required: '', units_needed: '', urgency_level: 'Medium', required_date: '', notes: '',
          hospital_name: localStorage.getItem('name') || 'General Hospital', location: 'Local Region'
        });
        fetchRequests();
      } else {
        alert("Submission Failed.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{maxWidth: '1200px'}}>
      <div className="dash-header" style={{textAlign: 'left'}}>
        <h1>Hospital Workspace</h1>
        <p>Manage patient blood requests and inventory.</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem'}}>
        
        {/* Left Col: Request Engine */}
        <div className="glass-panel" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <h3 style={{color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem'}}>1. AI Auto-Fill (Optional)</h3>
          <div style={{position: 'relative'}}>
            <textarea 
               value={rawNotes}
               onChange={(e) => setRawNotes(e.target.value)}
               placeholder="Paste doctor's raw notes here to let Gemini AI extract the data instantly..."
               style={{minHeight: '100px'}}
            />
            <button className="submit-btn" onClick={handleAutoFill} disabled={aiLoading} style={{width: '100%', marginTop: '0.5rem', background: 'var(--accent-blue)', color: '#000'}}>
              {aiLoading ? '🤖 Extracting...' : '✨ Magic Extract via Gemini'}
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
             <h3 style={{color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem'}}>2. Explicit Request Form</h3>
             
             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
               <input className="auth-input" type="text" name="patient_name" placeholder="Patient Name" value={formData.patient_name} onChange={handleInputChange} required />
               <input className="auth-input" type="number" name="patient_age" placeholder="Age" value={formData.patient_age} onChange={handleInputChange} required />
             </div>
             
             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
               <select className="auth-input" name="patient_gender" value={formData.patient_gender} onChange={handleInputChange} required>
                  <option value="">Gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
               </select>
               <input className="auth-input" type="text" name="blood_group_required" placeholder="Blood Group (e.g. O-)" value={formData.blood_group_required} onChange={handleInputChange} required />
             </div>

             <input className="auth-input" type="text" name="disease" placeholder="Disease / Reason (e.g. Surgery)" value={formData.disease} onChange={handleInputChange} />
             
             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
               <input className="auth-input" type="number" name="units_needed" placeholder="Units Needed" value={formData.units_needed} onChange={handleInputChange} required />
               <select className="auth-input" name="urgency_level" value={formData.urgency_level} onChange={handleInputChange}>
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟠 Medium</option>
                  <option value="Critical">🔴 Critical</option>
               </select>
             </div>

             <input className="auth-input" type="date" name="required_date" value={formData.required_date} onChange={handleInputChange} />
             <textarea className="auth-input" name="notes" placeholder="Additional Notes" value={formData.notes} onChange={handleInputChange} style={{minHeight: '80px'}}></textarea>
             
             <button type="submit" className="submit-btn" disabled={loading} style={{width: '100%', justifyContent: 'center'}}>
                {loading ? 'Routing to Network...' : 'Submit Final Request'}
             </button>
          </form>
        </div>

        {/* Right Col: active manager */}
        <div className="glass-panel">
          <h3 style={{color: 'white', marginBottom: '1.5rem'}}>Active Ward Requests</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {activeRequests.map((req, i) => (
              <div key={i} style={{background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <h4 style={{color: 'white', fontSize: '1.1rem'}}>{req.patient_name} <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>({req.patient_age} {req.patient_gender})</span></h4>
                  <span className={`badge ${req.urgency_level?.toLowerCase() === 'critical' ? 'badge-danger' : 'badge-warning'}`}>{req.urgency_level}</span>
                </div>
                <p style={{color: 'var(--accent-red)', fontWeight: 'bold', margin: '0.5rem 0'}}>{req.units_needed} Units of {req.blood_group_required}</p>
                <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Diagnosis: {req.disease || 'N/A'}</p>
                <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                   <button className="auth-input" style={{padding: '0.4rem', flex: 1, textAlign: 'center', background: 'rgba(102, 252, 241, 0.1)', color: 'var(--accent-blue)'}}>View Donors (0)</button>
                   <button className="auth-input" style={{padding: '0.4rem', width: '100px', textAlign: 'center', borderColor: 'var(--accent-red)', color: 'var(--accent-red)'}}>Close</button>
                </div>
              </div>
            ))}
            {activeRequests.length === 0 && (
              <p style={{color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem'}}>No active requests for your hospital.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
