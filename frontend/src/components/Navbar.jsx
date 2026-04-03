import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  // Logo destination: public home if not logged in, else role dashboard
  const logoHref = !role
    ? '/'
    : role === 'donor'
    ? '/donor?tab=dashboard'
    : role === 'hospital'
    ? '/hospital?tab=dashboard'
    : '/admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const isLoggedIn = role !== null;

  // Donor nav items
  const donorLinks = [
    { label: '🏠 Dashboard',     tab: 'dashboard'     },
    { label: '🚨 Requests',      tab: 'requests'      },
    { label: '📜 My Donations',  tab: 'donations'     },
    { label: '🔔 Notifications', tab: 'notifications' },
    { label: '👤 Profile',       tab: 'profile'       },
  ];

  // Hospital nav items
  const hospitalLinks = [
    { label: '🏠 Dashboard',       tab: 'dashboard' },
    { label: '➕ New Request',      tab: 'new'       },
    { label: '🩺 Active Requests',  tab: 'active'    },
    { label: '📋 History',          tab: 'history'   },
    { label: '👤 Profile',          tab: 'profile'   },
  ];

  const currentTab = new URLSearchParams(location.search).get('tab') || 'dashboard';

  const tabLinkStyle = (tab) => ({
    color: currentTab === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
    borderBottom: currentTab === tab ? '2px solid var(--accent-blue)' : '2px solid transparent',
    paddingBottom: '2px',
    fontSize: '0.92rem',
    transition: 'all 0.25s ease',
    textDecoration: 'none',
    fontWeight: currentTab === tab ? 600 : 400,
  });

  const basePath = role === 'donor' ? '/donor' : '/hospital';
  const roleLinks = role === 'donor' ? donorLinks : hospitalLinks;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Activity color="var(--accent-red)" size={28} />
        <Link to={logoHref}>Sanguis AI</Link>
      </div>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            {role === 'admin' && <Link to="/admin">Admin Panel</Link>}

            {(role === 'donor' || role === 'hospital') && roleLinks.map(({ label, tab }) => (
              <Link
                key={tab}
                to={`${basePath}?tab=${tab}`}
                style={tabLinkStyle(tab)}
              >
                {label}
              </Link>
            ))}

            {name && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hi, {name.split(' ')[0]}</span>}
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="submit-btn" style={{ padding: '0.4rem 1rem' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
