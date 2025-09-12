'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts } from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions?: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
}

interface ProductGridProps {
  limit?: number;
  title?: string;
}

export default function ProductGrid({ limit = 8, title }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const { addItem, isLoading: cartLoading } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('=== LOADING PRODUCTS ===');
        console.log('Fetching products with limit:', limit);
        const data = await fetchProducts(limit);
        console.log('Products data received:', data);
        
        const productsList = data.products.edges.map((edge: { node: Product }) => edge.node);
        console.log('Products list:', productsList);
        setProducts(productsList);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [limit]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const isTitleVisible = useCallback((index: number) => {
    if (!titleRefs.current[index]) return false;
    const rect = titleRefs.current[index]!.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.8;
  }, []);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const handleAddToCart = async (product: Product, selectedSize: string) => {
    console.log('=== ADD TO CART CLICKED ===');
    console.log('Product:', product);
    console.log('Selected size:', selectedSize);
    
    if (!product.variants.edges.length) {
      console.error('No variants available for product:', product.title);
      return;
    }

    // Find the variant that matches the selected size
    const variant = product.variants.edges.find(edge => {
      const sizeOption = edge.node.selectedOptions?.find(option => 
        option.name.toLowerCase() === 'size' || option.name.toLowerCase() === 'title'
      );
      return sizeOption?.value === selectedSize;
    })?.node;

    if (!variant) {
      console.error('No variant found for size:', selectedSize, 'Available variants:', product.variants.edges.map(e => e.node.selectedOptions));
      return;
    }

    console.log('Selected variant:', variant);
    console.log('Variant ID:', variant.id);
    console.log('Variant price:', variant.price);
    console.log('Variant selected options:', variant.selectedOptions);

    try {
      const image = product.images.edges[0]?.node;
      console.log('Product image:', image);
      
      const cartItem = {
        variantId: variant.id,
        title: product.title,
        price: parseFloat(variant.price.amount),
        quantity: 1,
        image: image?.url,
        size: selectedSize, // Keep for display purposes
      };
      
      console.log('Cart item to add:', cartItem);
      
      await addItem(cartItem);
      
      // Open cart drawer after successful add
      console.log('Dispatching cart.open event');
      window.dispatchEvent(new CustomEvent('cart.open'));
      
      console.log('Successfully added to cart:', product.title, selectedSize);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  if (loading) {
    return (
      <div className="product-grid-container">
        <div className="product-grid-loading">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid-container">
        <div className="product-grid-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="shop-section" className="product-grid-container">
      {title && (
        <div className="product-grid-header">
          <h2 className="product-grid-title">{title}</h2>
        </div>
      )}
      
      <div className="product-grid">
        {products.map((product, index) => {
          const image = product.images.edges[0]?.node;
          // Get all sizes, preferring available ones
          const allSizes = product.variants.edges.map(edge => {
            const sizeOption = edge.node.selectedOptions?.find(option => 
              option.name.toLowerCase() === 'size' || option.name.toLowerCase() === 'title'
            );
            return {
              size: sizeOption?.value,
              isAvailable: edge.node.availableForSale
            };
          }).filter(item => item.size);
          
          const availableSizes = allSizes.filter(item => item.isAvailable);
          const defaultSize = availableSizes[0]?.size || allSizes[0]?.size || 'S';
          const selectedSize = selectedSizes[product.id] || defaultSize;
          
          // Find the variant that matches the selected size
          const variant = product.variants.edges.find(edge => {
            const sizeOption = edge.node.selectedOptions?.find(option => 
              option.name.toLowerCase() === 'size' || option.name.toLowerCase() === 'title'
            );
            return sizeOption?.value === selectedSize;
          })?.node;
          
          const price = variant?.price || product.priceRange.minVariantPrice;
          
          return (
            <div key={product.id} className="product-item">
              <Link href={`/products/${product.handle}`}>
                <h3 
                  ref={(el) => {
                    titleRefs.current[index] = el;
                  }}
                  className="product-title"
                  style={{
                    color: isTitleVisible(index) ? '#000000' : '#666666',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  {product.title}
                </h3>
              </Link>
              
              <div className="product-image-container">
                <Link href={`/products/${product.handle}`}>
                  {image ? (
                    <>
                      {(image.url.toLowerCase().includes('.gif') || image.url.toLowerCase().includes('.webp')) ? (
                      <img
                        src={`${image.url.split('?')[0]}?quality=100&format=original&width=400&height=600`}
                        alt={image.altText || product.title}
                        className="product-image gif-image webp-image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        fill
                        className="product-image"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={false}
                        quality={100}
                      />
                      )}
                    </>
                  ) : (
                    <div className="product-image-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                </Link>
                
                {!variant?.availableForSale && (
                  <div className="product-sold-out">
                    <span>Sold Out</span>
                  </div>
                )}
              </div>
              
              <div className="product-card">
                <div className="variant-picker">
                  <span className="variant-label">Size</span>
                  <div className="variant-dropdown">
                    <select 
                      className="variant-select"
                      value={selectedSize}
                      onChange={(e) => handleSizeChange(product.id, e.target.value)}
                    >
                      {product.variants.edges
                        .map(edge => {
                          const sizeOption = edge.node.selectedOptions?.find(option => 
                            option.name.toLowerCase() === 'size' || option.name.toLowerCase() === 'title'
                          );
                          const size = sizeOption?.value;
                          const isAvailable = edge.node.availableForSale;
                          
                          return size ? (
                            <option 
                              key={edge.node.id} 
                              value={size}
                              disabled={!isAvailable}
                              style={{
                                textDecoration: !isAvailable ? 'line-through' : 'none',
                                opacity: !isAvailable ? 0.5 : 1,
                                color: !isAvailable ? '#999' : 'inherit'
                              }}
                            >
                              {size} {!isAvailable ? '(Sold Out)' : ''}
                            </option>
                          ) : null;
                        })
                        .filter(Boolean)}
                    </select>
                  </div>
                </div>
                <div className="product-info">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product, selectedSize)}
                    disabled={!variant?.availableForSale || cartLoading}
                    style={{
                      opacity: !variant?.availableForSale || cartLoading ? 0.6 : 1,
                      cursor: !variant?.availableForSale || cartLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <p className="product-price">
                    {formatPrice(price.amount, price.currencyCode)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
