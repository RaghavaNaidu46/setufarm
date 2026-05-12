import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';
import './Home.css';

const APP_URL = 'http://localhost:5173';

const STEPS = [
  { n: '01', title: 'farmers list crops',   desc: 'farmers upload produce with photos, quantity, and price — even by voice in their local language.' },
  { n: '02', title: 'buyers discover',      desc: 'buyers browse farm-fresh produce from verified local farmers near their location in real time.' },
  { n: '03', title: 'doorstep delivery',    desc: 'our verified driver network picks up and delivers directly from farm to buyer\'s door — same day.' },
];

const ROLES = [
  { ico: '👨‍🌾', title: 'for farmers',  sub: 'earn 3× more by selling direct',      link: '/farmers',  lbl: 'learn more' },
  { ico: '🛒',   title: 'for buyers',   sub: 'fresher produce at lower prices',     link: '/buyers',   lbl: 'learn more' },
  { ico: '🚚',   title: 'for drivers',  sub: 'earn on your own schedule',           link: '/how-it-works', lbl: 'learn more' },
];

const FEATS = [
  { ico: '📍', title: 'location discovery',     desc: 'find produce within 50 km using gps. always the freshest and nearest options.' },
  { ico: '🎙️', title: 'voice listings',         desc: 'farmers list crops by voice in their local language — zero typing required.' },
  { ico: '💳', title: 'secure payments',        desc: 'integrated razorpay ensures safe, fast payments for every transaction.' },
  { ico: '🔒', title: 'call masking',           desc: 'all driver–customer calls are masked to protect real phone numbers.' },
  { ico: '📦', title: 'real-time tracking',     desc: 'buyers track their order live from farm to door with driver location.' },
  { ico: '⭐', title: 'verified farmers',       desc: 'all farmers are verified with ratings so you always know who you buy from.' },
];

const TESTIS = [
  { q: 'before setufarm i sold tomatoes at ₹8/kg. now i get ₹22/kg directly from buyers. my income tripled.', name: 'ravi kumar',   role: 'tomato farmer · karimnagar',  init: 'R' },
  { q: 'produce is always fresher and cheaper than supermarkets. i now buy all vegetables through setufarm.',   name: 'priya sharma', role: 'regular buyer · hyderabad',    init: 'P' },
  { q: 'i deliver 15–20 orders a day and earn more than my previous job. payments are always on time.',         name: 'suresh babu',  role: 'delivery driver · vijayawada', init: 'S' },
];

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-left">
            <div className="home-eyebrow">🌱 100% farm to table · zero middlemen</div>
            <h1>
              the future of <em>farm-fresh</em><br />commerce is here
            </h1>
            <p>
              setufarm connects local farmers directly with buyers and delivery drivers —
              eliminating middlemen, tripling farmer income, and delivering fresher produce
              at better prices to every household.
            </p>
            <div className="home-btns">
              <a href={APP_URL} target="_blank" rel="noreferrer">
                <button className="home-btn-main">
                  <span>🛒</span> browse fresh produce
                </button>
              </a>
              <Link to="/how-it-works">
                <button className="home-btn-ghost">see how it works</button>
              </Link>
            </div>
            <div className="home-trust">
              <div className="trust-faces">
                {['R','P','S','A'].map(l => <span key={l}>{l}</span>)}
              </div>
              <span className="trust-txt"><strong>500+ farmers</strong> already earning more</span>
            </div>
          </div>

          {/* ── Animated Video Simulation ── */}
          <div className="home-hero-right">
            {/* Floating cards */}
            <div className="floating-card fc-1">
              <strong>🔥 148 Orders</strong> today
            </div>
            <div className="floating-card fc-2">
              <strong>Verified</strong> Farmers
            </div>

            <div className="video-simulation-container">
              <div className="video-player-chrome">
                <div className="chrome-dot"></div>
                <div className="chrome-dot"></div>
                <div className="chrome-dot"></div>
                <div className="chrome-title">SETUFARM_EXPLAINER.MP4</div>
              </div>

              <div className="simulated-video-content">
                <div className="flow-node node-farmer">👨‍🌾</div>
                <div className="flow-line line-1"></div>
                <div className="moving-package">📦</div>
                <div className="flow-node node-driver">🚚</div>
                <div className="flow-line line-2"></div>
                <div className="flow-node node-buyer">🛒</div>

                <div className="video-overlay-text">
                   Simulated Flow: Farmer lists ➔ Driver picks up ➔ Buyer receives
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section green-bg">
        <div className="section-inner">
          <div className="stats-grid">
            <div className="stat-cell"><span className="stat-num">500+</span><span className="stat-lbl">verified farmers</span></div>
            <div className="stat-cell"><span className="stat-num">1,200+</span><span className="stat-lbl">products listed daily</span></div>
            <div className="stat-cell"><span className="stat-num">3×</span><span className="stat-lbl">avg. income increase</span></div>
            <div className="stat-cell"><span className="stat-num">50 km</span><span className="stat-lbl">delivery coverage</span></div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section gray-bg">
        <div className="section-inner center">
          <span className="sec-eyebrow">how it works</span>
          <h2 className="sec-title">farm to door in 3 simple steps</h2>
          <p className="sec-sub">our platform makes it effortless for farmers, buyers, and drivers.</p>
          <div className="home-steps">
            {STEPS.map(s => (
              <div className="home-step" key={s.n}>
                <div className="home-step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/how-it-works" className="btn-outline">see detailed walkthrough →</Link>
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="section">
        <div className="section-inner center">
          <span className="sec-eyebrow">built for everyone</span>
          <h2 className="sec-title">pick your role on setufarm</h2>
          <p className="sec-sub">whether you grow food, buy it, or deliver it — setufarm works for you.</p>
          <div className="home-roles">
            {ROLES.map(r => (
              <div className="home-role card" key={r.title}>
                <div className="role-ico">{r.ico}</div>
                <div className="role-title">{r.title}</div>
                <p className="role-sub">{r.sub}</p>
                <Link to={r.link} className="role-btn">{r.lbl} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section dark-bg">
        <div className="section-inner center">
          <span className="sec-eyebrow">platform features</span>
          <h2 className="sec-title">everything you need, built in</h2>
          <p className="sec-sub">powerful tools that make agriculture commerce simple, secure, and efficient.</p>
          <div className="feat-grid">
            {FEATS.map(f => (
              <div className="feat-card" key={f.title}>
                <div className="feat-ico">{f.ico}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="section-inner center">
          <span className="sec-eyebrow">testimonials</span>
          <h2 className="sec-title">real people, real results</h2>
          <p className="sec-sub">hear from farmers, buyers, and drivers already using setufarm.</p>
          <div className="testi-grid">
            {TESTIS.map(t => (
              <div className="testi-card" key={t.name}>
                <div className="stars">★★★★★</div>
                <p className="quote">"{t.q}"</p>
                <div className="testi-author">
                  <div className="t-avatar">{t.init}</div>
                  <div><div className="t-name">{t.name}</div><div className="t-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>ready to join the farming revolution?</h2>
          <p>whether you're a farmer, buyer, or driver — setufarm has a place for you. join thousands of people already benefiting from direct farm commerce.</p>
          <div className="cta-btns">
            <a href={APP_URL} target="_blank" rel="noreferrer"><button className="cta-main">🛒 browse products</button></a>
            <a href={`${APP_URL}/role-selection`} target="_blank" rel="noreferrer"><button className="cta-ghost">join for free</button></a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
