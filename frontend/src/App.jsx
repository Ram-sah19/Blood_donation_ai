import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HospitalPortal from './pages/HospitalPortal';
import DonorPortal from './pages/DonorPortal';
import AdminDashboard from './pages/AdminDashboard';
import AdminSignup from './pages/AdminSignup';

// Mock Protected Route
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole && role !== 'admin') {
    return <Navigate to={`/${role}`} />;
  }
  return children;
};

export default function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px', width: '100%', display: 'flex', justifyContent: 'center', padding: '100px 2rem 2rem 2rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/superuser-setup" element={<AdminSignup />} />

          <Route path="/hospital" element={<ProtectedRoute allowedRole="hospital"><HospitalPortal /></ProtectedRoute>} />
          <Route path="/donor" element={<ProtectedRoute allowedRole="donor"><DonorPortal /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}
