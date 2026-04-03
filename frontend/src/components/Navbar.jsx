import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const isLoggedIn = role !== null;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Activity color="var(--accent-red)" size={28} />
        <Link to="/">Sanguis AI</Link>
      </div>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            {role === 'hospital' && <Link to="/hospital">Workspace</Link>}
            {role === 'donor' && <Link to="/donor">Dashboard</Link>}
            {role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="submit-btn" style={{padding: '0.4rem 1rem'}}>Sign</Link>
          </>
        )}
      </div>
    </nav>
  )
}
