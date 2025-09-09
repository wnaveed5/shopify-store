interface NavigationButtonsProps {
  cartCount?: number;
  onCartClick?: () => void;
  isCartOpen?: boolean;
}

export default function NavigationButtons({ cartCount = 0, onCartClick, isCartOpen = false }: NavigationButtonsProps) {
  const scrollToShop = () => {
    const shopSection = document.getElementById('shop-section');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="nav-buttons-container" style={{ display: 'flex', alignItems: 'center', gap: '5rem', position: 'relative', zIndex: 9999 }}>
      <button 
        onClick={scrollToShop}
        style={{ 
          color: '#000000', 
          fontFamily: "'Poppins', sans-serif", 
          fontSize: '18px', 
          fontWeight: 700, 
          letterSpacing: '-1px',
          marginLeft: '-6rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}
      >
        Shop
      </button>
      <span className="search-button" style={{ 
        color: '#000000', 
        fontFamily: "'Poppins', sans-serif", 
        fontSize: '18px', 
        fontWeight: 700, 
        letterSpacing: '-1px'
      }}>Search</span>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onCartClick) {
            onCartClick();
          }
        }}
        style={{ 
          color: isCartOpen ? '#8B5CF6' : '#000000', 
          fontFamily: "'Poppins', sans-serif", 
          fontSize: '18px', 
          fontWeight: 700, 
          letterSpacing: '-1px',
          marginRight: '2rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          touchAction: 'manipulation',
          transition: 'color 0.3s ease'
        }}
      >
        Cart
      </button>
    </div>
  );
}