import { Link } from 'react-router-dom';

const APP_URL = 'http://localhost:5173';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '.55rem' }}>
            <div className="nav-mark">🌾</div>
            <span className="nav-name">setufarm</span>
          </Link>
          <p>connecting local farmers directly with buyers and drivers. eliminating middlemen for a fairer agricultural economy.</p>
        </div>
        <div className="footer-col">
          <h5>platform</h5>
          <ul>
            <li><a href={APP_URL} target="_blank" rel="noreferrer">browse products</a></li>
            <li><a href={`${APP_URL}/role-selection`} target="_blank" rel="noreferrer">sell as farmer</a></li>
            <li><a href={`${APP_URL}/role-selection`} target="_blank" rel="noreferrer">deliver as driver</a></li>
            <li><a href={`${APP_URL}/login`} target="_blank" rel="noreferrer">login</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>company</h5>
          <ul>
            <li><Link to="/about">about us</Link></li>
            <li><Link to="/how-it-works">how it works</Link></li>
            <li><Link to="/farmers">for farmers</Link></li>
            <li><Link to="/buyers">for buyers</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>support</h5>
          <ul>
            <li><Link to="/contact">contact us</Link></li>
            <li><a href="#">help center</a></li>
            <li><Link to="/privacy">privacy policy</Link></li>
            <li><Link to="/terms">terms of service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 setufarm. all rights reserved.</span>
        <div className="footer-legal">
          <Link to="/privacy">privacy</Link>
          <Link to="/terms">terms</Link>
          <Link to="/cookies">cookies</Link>
        </div>
      </div>
    </footer>
  );
}
