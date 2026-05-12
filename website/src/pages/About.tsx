import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';

const TEAM = [
  { name: 'aravind terli',   role: 'founder & ceo',       init: 'A', bio: 'agri-tech entrepreneur passionate about eliminating middlemen and building direct-farmer commerce at scale.' },
  { name: 'tech team',       role: 'engineering',          init: 'T', bio: 'a lean, fast-moving team of engineers building the mobile, web, and backend infrastructure powering setufarm.' },
  { name: 'field team',      role: 'farmer onboarding',    init: 'F', bio: 'dedicated ground team across andhra pradesh and telangana helping farmers register and list their first crops.' },
];

const VALUES = [
  { ico: '🤝', title: 'fairness first',      desc: 'every feature we build is measured by whether it makes the system fairer for farmers. that\'s our north star.' },
  { ico: '🌱', title: 'local roots',         desc: 'we are built for indian agriculture — local languages, local crops, and local payment methods.' },
  { ico: '🔍', title: 'full transparency',   desc: 'buyers always know which farmer grew their food. farmers always know who bought their crop. no black boxes.' },
  { ico: '⚡', title: 'speed matters',       desc: 'same-day delivery, instant payments, real-time listings — agriculture commerce shouldn\'t be slow.' },
];

export default function About() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">our story</span>
          <h1>built to fix a broken system</h1>
          <p>setufarm was born from a simple question: why does a farmer selling tomatoes at ₹8/kg see the same tomatoes selling for ₹50 in city stores?</p>
        </div>
      </div>

      {/* mission */}
      <section className="section">
        <div className="section-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="sec-eyebrow">our mission</span>
            <h2 className="sec-title">eliminate the middleman. empower the farmer.</h2>
            <p className="sec-sub">
              india's agricultural supply chain has 4–6 middlemen between a farmer and a consumer.
              each one takes a cut, delays payment, and reduces what the farmer actually earns.
            </p>
            <br />
            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.75 }}>
              setufarm replaces all of them with a single, transparent digital platform.
              farmers list. buyers discover. drivers deliver. payments go directly to farmers.
              no agents. no mandi fees. no delayed payments.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { val: '500+', lbl: 'farmers onboarded' },
              { val: '3×', lbl: 'avg. income increase' },
              { val: '₹0', lbl: 'farmer commissions' },
              { val: '50km', lbl: 'delivery coverage' },
            ].map(s => (
              <div key={s.lbl} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.25rem', fontWeight: 900, color: '#15803d', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '.8rem', color: '#64748b', marginTop: '.3rem' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* values */}
      <section className="section gray-bg">
        <div className="section-inner center">
          <span className="sec-eyebrow">our values</span>
          <h2 className="sec-title">what we stand for</h2>
          <div className="feat-grid" style={{ marginTop: '3.5rem' }}>
            {VALUES.map(v => (
              <div key={v.title} className="card" style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '.85rem' }}>{v.ico}</div>
                <h4 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#0f172a', marginBottom: '.45rem' }}>{v.title}</h4>
                <p style={{ fontSize: '.82rem', color: '#64748b', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* team */}
      <section className="section">
        <div className="section-inner center">
          <span className="sec-eyebrow">the team</span>
          <h2 className="sec-title">the people behind setufarm</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3.5rem' }}>
            {TEAM.map(m => (
              <div key={m.name} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1rem',
                  background: 'linear-gradient(135deg, #4ade80, #15803d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', fontWeight: 800, color: '#fff',
                  boxShadow: '0 4px 16px rgba(22,163,74,.35)',
                }}>{m.init}</div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{m.name}</div>
                <div style={{ fontSize: '.75rem', color: '#15803d', fontWeight: 600, marginTop: '.2rem', marginBottom: '.75rem' }}>{m.role}</div>
                <p style={{ fontSize: '.82rem', color: '#64748b', lineHeight: 1.7 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
