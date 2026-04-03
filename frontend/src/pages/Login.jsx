import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');
      
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
      <div className="glass-panel" style={{maxWidth: '400px', margin: '0 auto'}}>
        <div className="header">
          <h2>Welcome Back</h2>
          <p>Login to Sanguis AI</p>
        </div>
        <form onSubmit={handleSubmit} className="input-section">
          {error && <div style={{ color: 'var(--accent-red)', textAlign: 'center' }}>{error}</div>}
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="submit-btn" disabled={loading} style={{width: '100%', justifyContent: 'center'}}>
            {loading ? <div className="loader"></div> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
