import Banner from '@/components/Banner';
import ProductGrid from '@/components/ProductGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Banner />
      <ProductGrid limit={8} />
      <footer className="hmr-footer">
        <div className="hmr-footer-logo">
          <svg viewBox="0 0 250 80" className="w-64 h-16">
            <title>Homura</title>
            <text 
              x="30" 
              y="60" 
              fill="#000000" 
              fontFamily="'Poppins', sans-serif" 
              fontSize="48" 
              fontWeight="700" 
              text-transform="lowercase"
              stroke="#000000"
              strokeWidth="0.5"
              letterSpacing="-3"
            >
              homura
            </text>
            <text 
              x="210" 
              y="35" 
              fill="#000000" 
              fontFamily="'Poppins', sans-serif" 
              fontSize="18" 
              fontWeight="700"
              stroke="#000000"
              strokeWidth="0.5"
            >
              ®
            </text>
          </svg>
        </div>
        <nav>
          <ul className="hmr-footer-list">
            <li className="hmr-footer-item">
              <strong>Contact</strong>
              <ul className="hmr-footer-sub-list">
                <li className="hmr-footer-sub-item">
                  <a href="/pages/contact-us">
                    Contact Us
                  </a>
                </li>
                <li className="hmr-footer-sub-item">
                  <button className="hmr-subscribe-button" type="button">Subscribe to Newsletter</button>
                </li>
              </ul>
            </li>
            <li className="hmr-footer-item">
              <strong>Social</strong>
              <ul className="hmr-footer-sub-list">
                <li className="hmr-footer-sub-item">
                  <a href="https://instagram.com/homer" target="_blank" rel="noreferrer noopener">
                    Instagram
                  </a>
                </li>
              </ul>
            </li>
            <li className="hmr-footer-item">
              <strong>About</strong>
              <ul className="hmr-footer-sub-list">
                <li className="hmr-footer-sub-item">
                  <a href="/pages/delivery-information">
                    Delivery Information
                  </a>
                </li>
                <li className="hmr-footer-sub-item">
                  <a href="/pages/returns-and-exchanges">
                    Returns and Exchanges
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}