import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnsPage() {
  return (
    <div className="returns-page-container">
      <div className="returns-page-content">
        <div className="returns-header">
          <h1 className="returns-title">Returns & Exchanges</h1>
        </div>

        <div className="returns-content">
          <div className="returns-info-section">
            <div className="returns-details">
              <div className="returns-item">
                <h3>Returns & Exchanges</h3>
                <p>We do not accept returns or exchanges unless the product arrives damaged or you receive the wrong item due to our error.</p>
              </div>
              
              <div className="returns-item">
                <h3>Questions?</h3>
                <p>Contact us at <a href="mailto:homuradesigns@gmail.com" className="email-link">homuradesigns@gmail.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
