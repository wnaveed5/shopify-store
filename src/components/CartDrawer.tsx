'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
  size?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  currencyCode: string;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  currencyCode,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}: CartDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent scrolling on mobile devices
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  const handleContinueShopping = () => {
    // Close the drawer
    handleClose();
    
    // Scroll to product grid after a short delay to ensure drawer is closed
    setTimeout(() => {
      const productGrid = document.querySelector('.product-grid-container');
      if (productGrid) {
        productGrid.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };

  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  // Don't render the drawer at all when closed
  if (!isOpen && !isAnimating) {
    return null;
  }

  return (
    <>
      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''} ${isAnimating ? 'cart-drawer--animating' : ''} ${cartItems.length === 0 ? 'cart-drawer--empty' : ''}`}>
        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="cart-drawer-empty">
              <p>Your cart is empty</p>
              <button className="cart-drawer-continue-shopping-mobile" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Mobile top header with continue shopping button */}
              <div className="cart-drawer-mobile-header">
                <button 
                  className="cart-drawer-continue-shopping-top"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
              </div>
              
              <div className="cart-drawer-items">
                {cartItems.map((item) => {
                  console.log('Rendering cart item:', item);
                  console.log('Item image:', item.image);
                  console.log('Item size:', item.size);
                  return (
                  <div key={item.id} className="cart-drawer-item">
                    <div className="cart-drawer-item-image">
                      {item.image ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.altText || item.title}
                          width={80}
                          height={80}
                          className="cart-item-image"
                          quality={90}
                          sizes="80px"
                          onError={(e) => {
                            console.error('Image failed to load:', item.image?.url);
                            e.currentTarget.style.display = 'none';
                            // Show placeholder
                            const placeholder = e.currentTarget.parentElement?.querySelector('.image-placeholder');
                            if (placeholder) {
                              (placeholder as HTMLElement).style.display = 'flex';
                            }
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', item.image?.url);
                          }}
                        />
                      ) : null}
                      <div className="image-placeholder" style={{ display: item.image ? 'none' : 'flex' }}>
                        <span>No Image</span>
                      </div>
                    </div>
                    
                    <div className="cart-drawer-item-details">
                      <div className="cart-drawer-item-title-price">
                        <h3 className="cart-drawer-item-title">{item.title}</h3>
                        <p className="cart-drawer-item-price">{formatPrice(item.price.amount)}</p>
                      </div>
                      {item.size && (
                        <div className="cart-drawer-item-size-container">
                          <p className="cart-drawer-item-size">Size: {item.size}</p>
                        </div>
                      )}
                      {!item.size && (
                        <div className="cart-drawer-item-size-container">
                          <p className="cart-drawer-item-size" style={{color: '#999', fontStyle: 'italic'}}>No size selected</p>
                        </div>
                      )}
                      
                      <div className="cart-drawer-item-controls">
                        <div className="cart-drawer-quantity">
                          <button
                            className="cart-drawer-quantity-btn"
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="cart-drawer-quantity-value">{item.quantity}</span>
                          <button
                            className="cart-drawer-quantity-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          className="cart-drawer-remove"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="cart-drawer-footer">
                <div className="cart-drawer-total">
                  <span className="cart-drawer-total-label">Subtotal</span>
                  <span className="cart-drawer-total-amount">
                    {formatPrice(cartTotal.toString())}
                  </span>
                </div>
                
                <button
                  className="cart-drawer-checkout"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}