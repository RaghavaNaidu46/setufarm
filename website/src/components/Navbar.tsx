import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const APP_URL = 'http://localhost:5173';

export default function Navbar() {
  const { pathname } = useLocation();
  const active = (path: string) => pathname === path ? 'nav-link active' : 'nav-link';
  
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <div className="nav-mark">🌾</div>
          <div className="nav-brand">
            <span className="nav-name">setufarm</span>
            <span className="nav-sub">farm to table</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link to="/"            className={active('/')}>home</Link>
          <Link to="/how-it-works" className={active('/how-it-works')}>how it works</Link>
          <Link to="/farmers"     className={active('/farmers')}>farmers</Link>
          <Link to="/buyers"      className={active('/buyers')}>buyers</Link>
          <Link to="/about"       className={active('/about')}>about</Link>
          <Link to="/contact"     className={active('/contact')}>contact</Link>
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? '☀️' : '🌙'}
          </button>
          
          <a href={`${APP_URL}/login`} target="_blank" rel="noreferrer">
            <button className="btn-login">login</button>
          </a>
          <a href={APP_URL} target="_blank" rel="noreferrer">
            <button className="btn-cta">browse products →</button>
          </a>
        </div>
      </div>
    </nav>
  );
}
