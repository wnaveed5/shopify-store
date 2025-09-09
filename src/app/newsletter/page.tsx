import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function NewsletterPage() {
  return (
    <div className="newsletter-page-container">
      <div className="newsletter-page-content">
        <div className="newsletter-header">
          <h1 className="newsletter-title">Stay Updated</h1>
        </div>

        <div className="newsletter-content">
          <div className="newsletter-form-section">
            <h2 className="form-title">Join Our Newsletter</h2>
            <NewsletterSignup />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
