import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-select role from ?role=donor or ?role=hospital
  const initialRole = new URLSearchParams(location.search).get('role') || 'donor';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
    bloodGroup: 'O+'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Signup failed');
      
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      
      const dest = data.role === 'donor' ? '/donor?tab=dashboard' : `/${data.role}`;
      window.location.href = dest;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel" style={{maxWidth: '500px', margin: '0 auto'}}>
        <div className="header">
          <h2>Create an Account</h2>
          <p>Join the Sanguis AI Network</p>
        </div>
        <form onSubmit={handleSubmit} className="input-section">
          {error && <div style={{ color: 'var(--accent-red)', textAlign: 'center' }}>{error}</div>}
          <div className="role-selector">
            <button 
              type="button" 
              className={`role-btn ${formData.role === 'donor' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, role: 'donor'})}
            >
              Blood Donor
            </button>
            <button 
              type="button" 
              className={`role-btn ${formData.role === 'hospital' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, role: 'hospital'})}
            >
              Hospital Staff
            </button>
          </div>

          <input 
            type="text" 
            placeholder={formData.role === 'hospital' ? "Hospital Name" : "Full Name"}
            required
            className="auth-input"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="auth-input"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          
          {formData.role === 'donor' && (
            <select 
              className="auth-input"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          )}

          <input 
            type="password" 
            placeholder="Password" 
            required
            className="auth-input"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="submit-btn" disabled={loading} style={{width: '100%', justifyContent: 'center', marginTop: '1rem'}}>
            {loading ? <div className="loader"></div> : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
