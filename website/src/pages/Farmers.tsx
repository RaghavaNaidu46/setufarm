import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';

const APP_URL = 'http://localhost:5173';

const BENEFITS = [
  { ico: '💰', title: 'earn 3× more per kg', desc: 'by selling directly to buyers, farmers get the full market price. no mandi commission, no middleman cuts.' },
  { ico: '📱', title: 'simple mobile app', desc: 'list your crop in under 2 minutes. take photos, set price, add quantity — and buyers near you see it instantly.' },
  { ico: '🎙️', title: 'voice listing support', desc: 'don\'t know how to type? no problem. speak your listing in telugu, hindi, or english and we transcribe it for you.' },
  { ico: '📍', title: 'location-aware reach', desc: 'your listings are shown to buyers within 50 km automatically. no manual targeting required.' },
  { ico: '💳', title: 'instant payment', desc: 'once your crop is delivered, payment hits your bank account instantly — no waiting, no paperwork.' },
  { ico: '📊', title: 'sales & earnings dashboard', desc: 'track all your listings, orders, deliveries, and total earnings in one place from your phone.' },
];

const FAQS = [
  { q: 'do i need a smartphone to use setufarm?', a: 'yes, a basic android smartphone with internet is required. our app is designed to work well even on low-end phones.' },
  { q: 'how does setufarm make money if farmers get 100%?', a: 'setufarm charges a small platform fee to buyers at checkout, not to farmers. the listed price is always what farmers receive.' },
  { q: 'what crops can i list on setufarm?', a: 'all agricultural produce — vegetables, fruits, grains, pulses, spices, dairy products, and more.' },
  { q: 'how quickly do i get paid?', a: 'payment is released to your bank account within minutes of the buyer confirming delivery.' },
  { q: 'what if a buyer cancels my order?', a: 'if a buyer cancels after you\'ve prepared the order, you are entitled to a cancellation fee. our support team handles disputes.' },
];

export default function Farmers() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">👨‍🌾 for farmers</span>
          <h1>sell direct. earn more. no middlemen.</h1>
          <p>setufarm gives you the tools to list your crops, reach buyers near you, and get paid the full price — directly into your bank account.</p>
        </div>
      </div>

      {/* income comparison */}
      <section className="section green-bg">
        <div className="section-inner center">
          <span className="sec-eyebrow">income comparison</span>
          <h2 className="sec-title">why setufarm beats the mandi</h2>
          <p className="sec-sub">see how much more a farmer earns by selling on setufarm vs. the traditional mandi model.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 720, margin: '3rem auto 0', textAlign: 'left' }}>
            <div className="card" style={{ borderColor: '#fca5a5', background: '#fff5f5' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '.75rem' }}>🏪 traditional mandi</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {['middleman takes 30–40%', 'price decided by traders', 'payment delayed days or weeks', 'no visibility into buyer demand', 'no record of transactions'].map(i => (
                  <li key={i} style={{ fontSize: '.84rem', color: '#64748b', display: 'flex', gap: '.5rem' }}><span>❌</span>{i}</li>
                ))}
              </ul>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fee2e2', borderRadius: 12 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '.06em' }}>avg. price received</div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2rem', fontWeight: 900, color: '#dc2626' }}>₹8/kg</div>
                <div style={{ fontSize: '.75rem', color: '#64748b' }}>for tomatoes (example)</div>
              </div>
            </div>
            <div className="card" style={{ borderColor: '#86efac', background: '#f0fdf4' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '.75rem' }}>🌾 setufarm</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {['100% price goes to farmer', 'you set your own price', 'instant payment after delivery', 'real-time demand from nearby buyers', 'full digital transaction history'].map(i => (
                  <li key={i} style={{ fontSize: '.84rem', color: '#64748b', display: 'flex', gap: '.5rem' }}><span>✅</span>{i}</li>
                ))}
              </ul>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#dcfce7', borderRadius: 12 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '.06em' }}>avg. price received</div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2rem', fontWeight: 900, color: '#15803d' }}>₹22/kg</div>
                <div style={{ fontSize: '.75rem', color: '#64748b' }}>for tomatoes (example)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* benefits */}
      <section className="section">
        <div className="section-inner center">
          <span className="sec-eyebrow">platform benefits</span>
          <h2 className="sec-title">everything a farmer needs</h2>
          <p className="sec-sub">setufarm is built specifically for Indian farmers — simple, local-language-friendly, and fair.</p>
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

      {/* FAQ */}
      <section className="section gray-bg">
        <div className="section-inner" style={{ maxWidth: 720 }}>
          <div className="center">
            <span className="sec-eyebrow">faq</span>
            <h2 className="sec-title">farmer questions answered</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3rem' }}>
            {FAQS.map(f => (
              <div key={f.q} className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0f172a', marginBottom: '.5rem', fontSize: '.95rem' }}>{f.q}</h4>
                <p style={{ fontSize: '.84rem', color: '#475569', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <h2>start earning more today</h2>
          <p>join 500+ farmers already selling directly on setufarm. registration is free and takes less than 5 minutes.</p>
          <div className="cta-btns">
            <a href={`${APP_URL}/role-selection`} target="_blank" rel="noreferrer"><button className="cta-main">👨‍🌾 register as farmer</button></a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
