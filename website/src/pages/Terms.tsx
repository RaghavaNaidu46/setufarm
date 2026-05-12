import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/shared.css';

export default function Terms() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow">legal</span>
          <h1>terms of service</h1>
          <p>last updated: may 2026</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ color: 'var(--text-primary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              welcome to setufarm. by accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. user accounts</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. you must provide accurate and complete information when creating an account.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. platform role</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              setufarm is a platform that connects farmers directly with buyers and drivers. we do not own the produce listed, nor do we employ the drivers. we facilitate the transaction and delivery but are not responsible for the quality of produce or the actions of independent drivers, though we maintain a verification system to ensure safety.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. payments and fees</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              payments are processed securely via razorpay. farmers receive the listed price without commission cuts. setufarm may charge a platform fee to buyers at checkout to maintain the service.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. conduct</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              users must not engage in fraudulent listings, harassment, or any activity that harms the platform or other users. we reserve the right to suspend accounts that violate these terms.
            </p>

            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>5. limitation of liability</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              setufarm shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
