import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DeliveryPage() {
  return (
    <div className="delivery-page-container">
      <div className="delivery-page-content">
        <div className="delivery-header">
          <h1 className="delivery-title">Delivery Information</h1>
        </div>

        <div className="delivery-content">
          <div className="delivery-info-section">
            <div className="delivery-details">
              <div className="delivery-item">
                <h3>Processing Time</h3>
                <p>Products will ship out in 5-7 business days</p>
              </div>
              
              <div className="delivery-item">
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
