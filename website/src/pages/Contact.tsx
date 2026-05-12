import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to backend API
    setSent(true);
  };

  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">get in touch</span>
          <h1>we'd love to hear from you</h1>
          <p>whether you're a farmer, buyer, driver, or investor — reach out and our team will respond within 24 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '4rem', alignItems: 'flex-start' }}>
          {/* left */}
          <div>
            <h2 className="sec-title" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>contact information</h2>
            <p style={{ color: '#64748b', lineHeight: 1.75, marginBottom: '2rem' }}>
              our support team is available monday to saturday, 9am–6pm IST.
            </p>
            {[
              { ico: '📧', lbl: 'email', val: 'support@setufarm.com' },
              { ico: '📞', lbl: 'phone', val: '+91 99999 00000' },
              { ico: '📍', lbl: 'address', val: 'hyderabad, telangana, india' },
            ].map(c => (
              <div key={c.lbl} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                }}>{c.ico}</div>
                <div>
                  <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '.06em' }}>{c.lbl}</div>
                  <div style={{ fontSize: '.9rem', color: '#1e293b', marginTop: '.15rem' }}>{c.val}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '2.5rem' }}>
              <div style={{ fontSize: '.82rem', fontWeight: 700, color: '#334155', marginBottom: '.75rem' }}>follow setufarm</div>
              <div style={{ display: 'flex', gap: '.65rem' }}>
                {['🐦 twitter', '📘 facebook', '📸 instagram'].map(s => (
                  <a key={s} href="#" style={{
                    display: 'inline-block', padding: '.4rem .85rem', borderRadius: 999,
                    background: '#f1f5f9', fontSize: '.78rem', fontWeight: 600, color: '#475569',
                    border: '1px solid #e2e8f0', transition: 'all .15s',
                  }}>{s}</a>
                ))}
              </div>
            </div>
          </div>

          {/* right — form */}
          <div className="card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#0f172a', marginBottom: '.5rem' }}>message sent!</h3>
                <p style={{ color: '#64748b' }}>our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#0f172a', marginBottom: '.25rem' }}>send us a message</h3>
                {[
                  { name: 'name',  label: 'your name',  type: 'text',  placeholder: 'ravi kumar' },
                  { name: 'email', label: 'email address', type: 'email', placeholder: 'ravi@example.com' },
                ].map(f => (
                  <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                    <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#334155' }}>{f.label}</label>
                    <input
                      type={f.type} name={f.name} required
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      style={{
                        height: 42, padding: '0 1rem', border: '1.5px solid #e2e8f0',
                        borderRadius: 10, fontSize: '.88rem', color: '#1e293b',
                        outline: 'none', transition: 'border-color .2s', background: '#f8fafc',
                      }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                  <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#334155' }}>subject</label>
                  <select
                    name="subject" value={form.subject} onChange={handleChange} required
                    style={{
                      height: 42, padding: '0 1rem', border: '1.5px solid #e2e8f0',
                      borderRadius: 10, fontSize: '.88rem', color: '#1e293b',
                      outline: 'none', background: '#f8fafc', appearance: 'none',
                    }}
                  >
                    <option value="">select a subject</option>
                    <option value="farmer">i'm a farmer — need help</option>
                    <option value="buyer">i'm a buyer — order issue</option>
                    <option value="driver">i'm a driver — inquiry</option>
                    <option value="partnership">partnership / business</option>
                    <option value="other">other</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                  <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#334155' }}>message</label>
                  <textarea
                    name="message" required rows={5}
                    value={form.message} onChange={handleChange}
                    placeholder="tell us how we can help..."
                    style={{
                      padding: '.75rem 1rem', border: '1.5px solid #e2e8f0',
                      borderRadius: 10, fontSize: '.88rem', color: '#1e293b',
                      outline: 'none', resize: 'vertical', background: '#f8fafc', fontFamily: 'inherit',
                    }}
                  />
                </div>
                <button type="submit" className="btn-green" style={{ marginTop: '.5rem', width: '100%', justifyContent: 'center', height: 46 }}>
                  send message →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
