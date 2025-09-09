import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {

  return (
    <div className="contact-page-container">
      <div className="contact-page-content">
        <div className="contact-header">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info-section">
            <h2 className="info-title">Get in Touch</h2>
            <div className="contact-email">
              <div className="contact-details">
                <h3>Email Us</h3>
                <p>For any inquiries, questions, or support:</p>
                <a href="mailto:homuradesigns@gmail.com" className="email-link">
                  homuradesigns@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
