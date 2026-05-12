import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';

export default function Cookies() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">legal</span>
          <h1>cookies policy</h1>
          <p>last updated: may 2026</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ color: 'var(--text-primary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              this cookies policy explains how setufarm uses cookies and similar technologies to recognize you when you visit our website.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. what are cookies?</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              cookies are small data files that are placed on your computer or mobile device when you visit a website. they are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. why we use cookies</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              we use cookies for several reasons. some cookies are required for technical reasons for our website to operate (e.g., keeping you logged in). other cookies enable us to track and target the interests of our users to enhance the experience on our platform (e.g., remembering your theme preference).
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. types of cookies we use</h2>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li><strong>essential cookies:</strong> strictly necessary to provide you with services available through our website.</li>
              <li><strong>preference cookies:</strong> used to remember your settings and preferences (like dark mode).</li>
              <li><strong>analytics cookies:</strong> help us understand how our platform is being used so we can improve it.</li>
            </ul>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. how can i control cookies?</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              you have the right to decide whether to accept or reject cookies. you can set or amend your web browser controls to accept or refuse cookies. if you choose to reject cookies, you may still use our website though your access to some functionality may be restricted.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
