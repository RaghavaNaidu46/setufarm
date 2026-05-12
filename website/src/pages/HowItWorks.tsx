import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';

const APP_URL = 'http://localhost:5173';

const STEPS = [
  {
    n: '01', ico: '📸', title: 'farmer lists a crop',
    desc: 'a farmer opens the setufarm app and selects "list crop". they fill in the crop name, quantity available, and asking price per kg. they can take photos directly with their phone camera or upload existing ones.',
    extra: ['voice listing available in telugu, hindi & english', 'auto-fills location from gps', 'price suggestion based on local market rates'],
  },
  {
    n: '02', ico: '🔍', title: 'buyer discovers the listing',
    desc: 'buyers open the setufarm platform and see a real-time feed of fresh produce available near them. they can filter by crop type, price range, distance, and farmer rating.',
    extra: ['sorted by distance by default', 'see farmer profile, rating & past orders', 'compare prices across multiple farmers'],
  },
  {
    n: '03', ico: '🛒', title: 'buyer places an order',
    desc: 'the buyer selects a product, chooses quantity, picks a delivery option (pick-up or home delivery), and completes secure payment through razorpay.',
    extra: ['razorpay upi, card, net banking supported', 'farmer gets instant order notification', 'buyer gets order confirmation & tracking link'],
  },
  {
    n: '04', ico: '🚚', title: 'driver picks up & delivers',
    desc: 'a nearby verified driver accepts the delivery request, picks up the produce from the farmer, and delivers it to the buyer. both parties can track the driver in real time.',
    extra: ['driver identity verified by setufarm', 'call masking protects real phone numbers', 'proof of delivery photo required'],
  },
  {
    n: '05', ico: '💰', title: 'farmer receives payment',
    desc: 'once delivery is confirmed, payment is released to the farmer\'s bank account instantly. no waiting, no commission cuts from the price, no middlemen.',
    extra: ['instant transfer after delivery confirmation', 'full price goes to farmer — no commission', 'full transaction history in-app'],
  },
];

export default function HowItWorks() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">transparency first</span>
          <h1>how setufarm works</h1>
          <p>from farm listing to doorstep delivery — here's every step of the setufarm journey explained in detail.</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="hiw-flow">
            {STEPS.map((s, i) => (
              <div className={`hiw-step ${i % 2 === 1 ? 'hiw-step-reverse' : ''}`} key={s.n}>
                <div className="hiw-step-visual">
                  <div className="hiw-step-bubble">
                    <span className="hiw-step-ico">{s.ico}</span>
                    <span className="hiw-step-n">{s.n}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="hiw-connector" />}
                </div>
                <div className="hiw-step-content card">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <ul>
                    {s.extra.map(e => <li key={e}>{e}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <h2>experience it yourself</h2>
          <p>ready to see setufarm in action? browse available products or join as a farmer or driver today.</p>
          <div className="cta-btns">
            <a href={APP_URL} target="_blank" rel="noreferrer"><button className="cta-main">🛒 browse products</button></a>
            <a href={`${APP_URL}/role-selection`} target="_blank" rel="noreferrer"><button className="cta-ghost">join setufarm</button></a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .hiw-flow { display: flex; flex-direction: column; gap: 3rem; padding-top: 1rem; }
        .hiw-step { display: grid; grid-template-columns: 80px 1fr; gap: 2rem; align-items: flex-start; }
        .hiw-step-reverse { direction: rtl; }
        .hiw-step-reverse > * { direction: ltr; }
        .hiw-step-visual { display: flex; flex-direction: column; align-items: center; }
        .hiw-step-bubble {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, var(--g500), var(--g700));
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          box-shadow: 0 4px 18px rgba(22,163,74,.4); flex-shrink: 0;
        }
        .hiw-step-ico { font-size: 1.4rem; line-height: 1; }
        .hiw-step-n { font-size: .6rem; font-weight: 800; color: rgba(255,255,255,.7); letter-spacing: .05em; }
        .hiw-connector { width: 2px; flex: 1; min-height: 40px; background: linear-gradient(180deg, var(--g500), var(--g300)); margin-top: .5rem; }
        .hiw-step-content h3 {
          font-family: 'Poppins', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--sl900); margin-bottom: .65rem;
        }
        .hiw-step-content p { font-size: .88rem; color: var(--sl600); line-height: 1.75; margin-bottom: 1rem; }
        .hiw-step-content ul { list-style: none; display: flex; flex-direction: column; gap: .4rem; }
        .hiw-step-content ul li {
          font-size: .8rem; color: var(--sl600); display: flex; align-items: center; gap: .5rem;
        }
        .hiw-step-content ul li::before { content: '✅'; font-size: .7rem; flex-shrink: 0; }
        @media (max-width: 640px) {
          .hiw-step { grid-template-columns: 1fr; }
          .hiw-step-visual { flex-direction: row; gap: 1rem; margin-bottom: .5rem; }
          .hiw-connector { display: none; }
          .hiw-step-reverse { direction: ltr; }
        }
      `}</style>
    </>
  );
}
