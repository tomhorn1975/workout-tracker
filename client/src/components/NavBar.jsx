import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <button className={`nav-btn ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Home
      </button>

      <button className={`nav-btn ${isActive('/history') ? 'active' : ''}`} onClick={() => navigate('/history')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        History
      </button>

      <button className="nav-scan-btn" onClick={() => navigate('/scan')} title="Scan QR">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
          <rect x="7" y="7" width="10" height="10" rx="1" />
        </svg>
      </button>

      <button className={`nav-btn ${isActive('/admin') ? 'active' : ''}`} onClick={() => navigate('/admin')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
        Admin
      </button>

      <button className={`nav-btn`} onClick={() => {}}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
        About
      </button>
    </nav>
  );
}
