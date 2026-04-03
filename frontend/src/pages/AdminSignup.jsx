import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Master Admin',
    email: '',
    password: '',
    role: 'admin',
    admin_secret: ''
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
      
      window.location.href = `/${data.role}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel" style={{maxWidth: '500px', margin: '0 auto', borderColor: 'var(--accent-red)'}}>
        <div className="header">
          <h2>Hidden Protocol</h2>
          <p>Register as System Administrator</p>
        </div>
        <form onSubmit={handleSubmit} className="input-section">
          {error && <div style={{ color: 'var(--accent-red)', textAlign: 'center' }}>{error}</div>}

          <input 
            type="email" 
            placeholder="Admin Email" 
            required
            className="auth-input"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Strong Password" 
            required
            className="auth-input"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="ADMIN_REGISTRATION_CODE" 
            required
            className="auth-input"
            onChange={(e) => setFormData({...formData, admin_secret: e.target.value})}
          />
          <button type="submit" className="submit-btn" disabled={loading} style={{width: '100%', justifyContent: 'center', marginTop: '1rem'}}>
            {loading ? <div className="loader"></div> : 'Bypass Initialization'}
          </button>
        </form>
      </div>
    </div>
  );
}
