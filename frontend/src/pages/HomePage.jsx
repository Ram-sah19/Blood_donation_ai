import { Link } from 'react-router-dom';
import { Activity, DropletIcon, ShieldCheck, Brain } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Hero */}
      <section style={{
        width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', padding: '4rem 2rem 5rem',
        gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.3)', borderRadius: '999px', padding: '0.4rem 1.2rem', fontSize: '0.88rem', color: 'var(--accent-red)' }}>
          <Activity size={14} /> AI-Powered Blood Donation Network
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.15,
          background: 'linear-gradient(135deg, #ffffff 40%, var(--accent-red))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Every Second Counts.<br />Every Drop Matters.
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.7 }}>
          <strong style={{ color: 'white' }}>Sanguis AI</strong> connects hospitals in crisis with willing donors in real-time, powered by Gemini AI and predictive analytics.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/signup?role=donor" className="submit-btn" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            🔴 Become a Donor
          </Link>
          <Link to="/signup?role=hospital" style={{
            padding: '0.9rem 2.2rem', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px', color: 'white', textDecoration: 'none', fontWeight: 600,
            background: 'rgba(255,255,255,0.05)', transition: 'all 0.3s ease',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          }}>
            🏥 Register as Hospital
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ width: '100%', maxWidth: '1100px', padding: '0 2rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {[
          {
            icon: <Brain size={28} color="var(--accent-blue)" />,
            title: 'Gemini AI Extraction',
            body: 'Hospitals type natural language requests. Our AI extracts blood type, urgency, units, and location automatically.',
          },
          {
            icon: <Activity size={28} color="var(--accent-red)" />,
            title: 'Real-Time Alerts',
            body: 'Donors receive instant push alerts for critical requests matching their blood group and location.',
          },
          {
            icon: <ShieldCheck size={28} color="#ffc107" />,
            title: 'Secure & Role-Based',
            body: 'JWT-authenticated portals for Donors, Hospitals, and Admins with bcrypt password security.',
          },
          {
            icon: <DropletIcon size={28} color="var(--accent-red)" />,
            title: 'Predictive Matching',
            body: 'ML model trained on donation data predicts the best donor-hospital routing strategy.',
          },
        ].map(({ icon, title, body }) => (
          <div key={title} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icon}
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'white', fontWeight: 700 }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{body}</p>
          </div>
        ))}
      </section>

      {/* CTA Strip */}
      <section style={{
        width: '100%', maxWidth: '1100px', margin: '0 2rem 5rem',
        borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255,75,75,0.15), rgba(102,252,241,0.08))',
        border: '1px solid rgba(255,75,75,0.3)',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.8rem' }}>Ready to Save a Life?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Sign up as a Donor or register your Hospital today.</p>
        <Link to="/signup" className="submit-btn" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem', display: 'inline-flex' }}>
          Get Started →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ width: '100%', textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        © {new Date().getFullYear()} Sanguis AI · Built with ❤️ for humanity
      </footer>
    </div>
  );
}
