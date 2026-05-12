import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';

const APP_URL = 'http://localhost:5173';

const BENEFITS = [
  { ico: '🌿', title: 'always fresh produce',   desc: 'buy crops harvested within 24 hours. no cold storage, no preservatives — straight from the farm.' },
  { ico: '💰', title: 'lowest prices',           desc: 'cutting out middlemen means you pay farm-gate prices, often 30–50% cheaper than retail stores.' },
  { ico: '📍', title: 'buy local, support local',desc: 'every purchase supports a local farmer in your district. you can see their name, village, and rating.' },
  { ico: '🚚', title: 'same-day delivery',       desc: 'drivers deliver your order on the same day, straight from the farm to your doorstep.' },
  { ico: '🔒', title: 'safe & secure',           desc: 'all payments via razorpay. your phone number is masked during deliveries. fully verified drivers.' },
  { ico: '⭐', title: 'rate & review',           desc: 'after each delivery, rate the farmer and driver. your feedback keeps the platform quality high.' },
];

export default function Buyers() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">🛒 for buyers</span>
          <h1>fresh from the farm. delivered to your door.</h1>
          <p>buy directly from verified local farmers at farm-gate prices — fresher produce, lower cost, and a positive impact on local farmers.</p>
        </div>
      </div>

      {/* benefits */}
      <section className="section">
        <div className="section-inner center">
          <span className="sec-eyebrow">why buyers love setufarm</span>
          <h2 className="sec-title">better for you, better for farmers</h2>
          <p className="sec-sub">setufarm isn't just a marketplace — it's a movement to make food supply chains fair and transparent for everyone.</p>
          <div className="feat-grid" style={{ marginTop: '3.5rem' }}>
            {BENEFITS.map(b => (
              <div key={b.title} className="card" style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '.85rem' }}>{b.ico}</div>
                <h4 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#0f172a', marginBottom: '.45rem' }}>{b.title}</h4>
                <p style={{ fontSize: '.82rem', color: '#64748b', lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how to buy */}
      <section className="section gray-bg">
        <div className="section-inner center">
          <span className="sec-eyebrow">quick guide</span>
          <h2 className="sec-title">how to place your first order</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginTop: '3rem' }}>
            {[
              { n: '1', ico: '🔍', t: 'browse products', d: 'visit setufarm and browse fresh listings near your location.' },
              { n: '2', ico: '🛒', t: 'add to cart',     d: 'select the crops and quantity you want. see the farmer profile.' },
              { n: '3', ico: '💳', t: 'pay securely',    d: 'complete payment via upi, card, or net banking through razorpay.' },
              { n: '4', ico: '📦', t: 'get delivered',   d: 'a verified driver picks up from the farm and delivers to your door.' },
            ].map(s => (
              <div key={s.n} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', margin: '0 auto .9rem',
                  background: 'linear-gradient(135deg,#22c55e,#15803d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', boxShadow: '0 4px 14px rgba(22,163,74,.38)',
                }}>{s.ico}</div>
                <h4 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#0f172a', marginBottom: '.4rem', fontSize: '.9rem' }}>{s.t}</h4>
                <p style={{ fontSize: '.8rem', color: '#64748b', lineHeight: 1.65 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="section">
        <div className="section-inner center">
          <span className="sec-eyebrow">buyer stories</span>
          <h2 className="sec-title">what our buyers say</h2>
          <div className="testi-grid">
            {[
              { q: 'the vegetables are so much fresher than what i used to get at the supermarket. and the prices are amazing!', name: 'priya sharma', role: 'regular buyer · hyderabad', init: 'P' },
              { q: 'i can see exactly which farmer grew my food and where. that kind of transparency is priceless to me.', name: 'ananya reddy', role: 'weekly buyer · warangal', init: 'A' },
              { q: 'i ordered 10 kg of onions and got them delivered in 4 hours. it cost me 40% less than the local shop.', name: 'vikram nair', role: 'bulk buyer · secunderabad', init: 'V' },
            ].map(t => (
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

      <section className="cta-section">
        <div className="cta-inner">
          <h2>ready to taste the difference?</h2>
          <p>browse fresh produce listed by local farmers near you right now. no account needed to explore.</p>
          <div className="cta-btns">
            <a href={APP_URL} target="_blank" rel="noreferrer"><button className="cta-main">🛒 browse products now</button></a>
            <a href={`${APP_URL}/role-selection`} target="_blank" rel="noreferrer"><button className="cta-ghost">create free account</button></a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
