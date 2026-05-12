import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';

export default function Privacy() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">legal</span>
          <h1>privacy policy</h1>
          <p>last updated: may 2026</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ color: 'var(--text-primary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              at setufarm, we are committed to protecting your privacy. this privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our mobile application.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. information we collect</h2>
            <p style={{ marginBottom: '1rem' }}>
              we collect information that you provide directly to us when you register for an account, list a crop, make a purchase, or communicate with us.
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li><strong>farmers:</strong> name, contact details, location data (gps), farm details, and bank account information for payments.</li>
              <li><strong>buyers:</strong> name, delivery address, contact details, and payment information (processed securely via razorpay).</li>
              <li><strong>drivers:</strong> name, vehicle details, driving license, location data, and payout details.</li>
            </ul>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. how we use your information</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              we use the collected information to facilitate the direct commerce between farmers and buyers, coordinate deliveries with drivers, process payments, and improve our platform services. we also use location data to show relevant listings within a 50 km radius.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. information sharing</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              we do not sell your personal information. we share your information only as necessary to complete transactions (e.g., sharing delivery address with the assigned driver) and with secure third-party services like razorpay for payment processing.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. security</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              we use administrative, technical, and physical security measures to help protect your personal information. call masking is used to protect phone numbers during delivery coordination.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>5. contact us</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              if you have questions or comments about this privacy policy, please contact us at support@setufarm.com.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
