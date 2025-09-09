'use client';

import Link from 'next/link';
import NavigationButtons from './NavigationButtons';
import CartDrawer from './CartDrawer';
import HeaderProducts from './HeaderProducts';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string;
  };
}

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items: cartItems, getTotalItems, getTotalPrice, removeItem, updateQuantity, checkoutUrl } = useCart();

  // Transform cart items to match CartDrawer interface
  const transformedCartItems: CartItem[] = cartItems.map(item => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    price: {
      amount: item.price.toString(),
      currencyCode: 'USD'
    },
    image: item.image ? {
      url: item.image,
      altText: item.title
    } : undefined,
    size: item.size
  }));

  // Debug logging
  console.log('Cart items from context:', cartItems);
  console.log('Transformed cart items:', transformedCartItems);
  console.log('Cart total:', getTotalPrice());
  console.log('Cart count:', getTotalItems());


  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Listen for cart open event
    const handleCartOpen = () => {
      setIsCartOpen(true);
    };

    window.addEventListener('cart.open', handleCartOpen);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('cart.open', handleCartOpen);
    };
  }, []);

  const handleCartClick = () => {
    setIsCartOpen(prev => !prev);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
    } else {
      await updateQuantity(itemId, quantity);
    }
  };

  const handleCheckout = () => {
    console.log('=== CHECKOUT CLICKED ===');
    console.log('Cart items before checkout:', cartItems);
    console.log('Checkout URL:', checkoutUrl);
    console.log('Cart items with sizes:', cartItems.map(item => ({ 
      title: item.title, 
      size: item.size,
      variantId: item.variantId 
    })));
    
    // Log each item's attributes that would be sent to Shopify
    cartItems.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        title: item.title,
        size: item.size,
        variantId: item.variantId,
        quantity: item.quantity
      });
    });
    
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      console.error('No checkout URL available');
    }
  };

  return (
    <header className="hmr-header">
      <div className="hmr-header-logo-wrap">
        <Link href="/" className="hmr-header-logo">
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
              x="215" 
              y="35" 
              fill="#000000" 
              fontFamily="'Poppins', sans-serif" 
              fontSize="18"
              fontWeight="700"
              stroke="#000000"
              strokeWidth="0.3"
              className="registered-symbol"
            >
              ®
            </text>
          </svg>
        </Link>
      </div>
      
      <div className="hmr-nav-wrap">
        <nav className="hmr-nav">
          <NavigationButtons 
            cartCount={getTotalItems()}
            onCartClick={handleCartClick}
            isCartOpen={isCartOpen}
          />
          
          <nav className="hmr-subnav hmr-menu" id="hmr-menu">
            <Link className="hmr-menu-shop-all" href="/collections/shop">All</Link>
            <HeaderProducts />
            
            <ul className="hmr-menu-links">
              <li className="hmr-menu-link">
                <Link href="/pages/contact-us" tabIndex={-1}>
                  Customer Service
                </Link>
              </li>
              <li className="hmr-menu-link">
                <Link href="/account" tabIndex={-1}>
                  Account
                </Link>
              </li>
              <li className="hmr-menu-link hmr-menu-link--search">
                <form action="/search" method="get" role="search">
                  <label className="ada-hidden" htmlFor="mobile-search-input">Search</label>
                  <div className="hmr-search-field">
                    <input type="search" id="mobile-search-input" name="q" placeholder="Search" required tabIndex={-1} />
                    <button aria-label="Click to search products" className="hmr-search-field-submit" tabIndex={-1} type="submit">
                      <svg enableBackground="new 0 0 12 14" viewBox="0 0 12 14">
                        <title>Search</title>
                        <g fill="none" stroke="currentColor">
                          <path d="m7.5 1c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"></path>
                          <path d="m5.2 8.5-4.5 5" strokeLinecap="round"></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                </form>
              </li>
            </ul>
          </nav>
          
          <form action="/search" className="hmr-subnav hmr-search" id="hmr-search" method="get" role="search">
            <label className="ada-hidden" htmlFor="header-search-input">Search</label>
            <div className="hmr-search-field">
              <input type="search" id="header-search-input" name="q" placeholder="..." required tabIndex={-1} />
              <button aria-label="Click to search products" className="hmr-search-field-submit" tabIndex={-1} type="submit">
                <svg enableBackground="new 0 0 12 14" viewBox="0 0 12 14">
                  <title>Search</title>
                  <g fill="none" stroke="currentColor">
                    <path d="m7.5 1c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"></path>
                    <path d="m5.2 8.5-4.5 5" strokeLinecap="round"></path>
                  </g>
                </svg>
              </button>
            </div>
          </form>
          
          {/* Shopify cart dropdown - hidden in favor of React cart drawer */}
          <div className="hmr-subnav hmr-cart" id="hmr-cart" style={{ display: 'none' }}>
            <div className="hmr-cart-empty on">Your cart is empty</div>
            <div className="hmr-cart-full">
              <ul className="hmr-cart-list"></ul>
              <Link className="hmr-cart-edit" href="/cart" tabIndex={-1}>Edit Cart</Link>
              <div className="hmr-cart-item hmr-cart-item--total">
                <div>Subtotal</div>
                <div data-cart-total="">$ 0.00</div>
              </div>
              <Link data-checkout="" className="button" href="/checkout" tabIndex={-1}>
                <div>Checkout</div>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCartClose}
        cartItems={transformedCartItems}
        cartTotal={getTotalPrice()}
        currencyCode="USD"
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </header>
  );
}
