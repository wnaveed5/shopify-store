'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProductByHandle, fetchProducts, createCartAndGetCheckoutUrl } from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';
import { formatDescription } from '@/lib/descriptionFormatter';
import SizeChartModal from '@/components/SizeChartModal';
import Footer from '@/components/Footer';

interface ProductVariant {
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
}

interface ProductImage {
  url: string;
  altText: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
}

interface RelatedProduct {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export default function ProductPage() {
  const params = useParams();
  const handle = params.handle as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  
  const { addItem, isLoading: cartLoading } = useCart();

  const loadRelatedProducts = async () => {
    try {
      setRelatedLoading(true);
      console.log('=== LOADING RELATED PRODUCTS ===');
      console.log('Current handle:', handle);
      const data = await fetchProducts(20); // Get more products
      console.log('Fetched data:', data);
      
      if (data.products?.edges) {
        console.log('Found products edges:', data.products.edges.length);
        // Get all products and filter out the current one
        const allProducts = data.products.edges.map((edge: any) => edge.node);
        console.log('All products:', allProducts.map((p: any) => p.title));
        const otherProducts = allProducts.filter((product: any) => product.handle !== handle);
        console.log('Other products (filtered):', otherProducts.map((p: any) => p.title));
        
        // Show only 2 other products
        const finalProducts = otherProducts.slice(0, 2);
        console.log('Final products to show:', finalProducts.map((p: any) => p.title));
        setRelatedProducts(finalProducts);
      } else {
        console.log('No products edges found in data');
      }
    } catch (err) {
      console.error('Error loading related products:', err);
    } finally {
      setRelatedLoading(false);
      console.log('Related products loading finished');
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductByHandle(handle);
        
        if (!data.productByHandle) {
          setError('Product not found');
          return;
        }
        
        setProduct(data.productByHandle);
        
        // Set default options
        const defaultOptions: Record<string, string> = {};
        data.productByHandle.options.forEach((option: { name: string; values: string[] }) => {
          if (option.values.length > 0) {
            defaultOptions[option.name] = option.values[0];
          }
        });
        setSelectedOptions(defaultOptions);
        
        // Load related products after main product loads
        loadRelatedProducts();
        
      } catch (err) {
        setError('Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      loadProduct();
    }
  }, [handle]);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const getSelectedVariant = () => {
    if (!product) return null;
    
    return product.variants.edges.find(edge => {
      const variant = edge.node;
      if (!variant.selectedOptions) return false;
      
      return variant.selectedOptions.every(option => 
        selectedOptions[option.name] === option.value
      );
    })?.node;
  };


  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const variant = getSelectedVariant();
    if (!variant) {
      console.error('No variant found for selected options');
      return;
    }

    if (!variant.availableForSale) {
      console.error('Selected variant is not available for sale');
      return;
    }

    try {
      const image = product.images.edges[0]?.node;
      
      const cartItem = {
        variantId: variant.id,
        title: product.title,
        price: parseFloat(variant.price.amount),
        quantity: quantity,
        image: image?.url,
        size: selectedOptions.Size || selectedOptions.Title || 'Default',
      };
      
      await addItem(cartItem);
      
      // Open cart drawer after successful add
      window.dispatchEvent(new CustomEvent('cart.open'));
      
      console.log('Successfully added to cart:', product.title);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleCheckout = async () => {
    if (!product) return;
    
    const variant = getSelectedVariant();
    if (!variant) {
      console.error('No variant found for selected options');
      return;
    }

    if (!variant.availableForSale) {
      console.error('Selected variant is not available for sale');
      return;
    }

    try {
      setCheckoutLoading(true);
      
      // Create cart with the selected variant and get checkout URL
      const lineItems = [{
        merchandiseId: variant.id,
        quantity: quantity,
      }];

      const checkoutUrl = await createCartAndGetCheckoutUrl(lineItems);
      
      // Redirect to Shopify checkout
      window.location.href = checkoutUrl;
      
      console.log('Successfully created cart and redirecting to checkout:', product.title);
    } catch (error) {
      console.error('Error creating checkout:', error);
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-page-container">
        <div className="product-page-loading">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page-container">
        <div className="product-page-error">
          <h1>Product Not Found</h1>
          <p>{error || 'The product you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  const selectedVariant = getSelectedVariant();
  const images = product.images.edges.map(edge => edge.node);
  const currentImage = images[selectedImageIndex];

  return (
    <div className="product-page-container">
      <div className="product-page-content">
        {/* Product Images */}
        <div className="product-images-section">
          <div className="product-main-image">
            {currentImage && (
              <>
                {(currentImage.url.toLowerCase().includes('.gif') || product.handle === 'bruce-lee-t' || product.handle === 'samurai-t') ? (
                <img
                  src={product.handle === 'bruce-lee-t' ? '/images/Untitled design (2).gif' : 
                        product.handle === 'samurai-t' ? '/images/ezgif.com-animated-gif-maker (1).gif' : 
                        currentImage.url}
                  alt={currentImage.altText || product.title}
                  className="product-image gif-image"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  width={1200}
                  height={1200}
                  className="product-image"
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />
                )}
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="product-thumbnail-images">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log('Thumbnail clicked:', index);
                    setSelectedImageIndex(index);
                  }}
                  className={`thumbnail-button ${index === selectedImageIndex ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {(image.url.toLowerCase().includes('.gif') || product.handle === 'bruce-lee-t' || product.handle === 'samurai-t') ? (
                    <img
                      src={product.handle === 'bruce-lee-t' ? '/images/Untitled design (2).gif' : 
                            product.handle === 'samurai-t' ? '/images/ezgif.com-animated-gif-maker (1).gif' : 
                            image.url}
                      alt={image.altText || product.title}
                      className="thumbnail-image gif-image"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      width={150}
                      height={150}
                      className="thumbnail-image"
                      quality={100}
                      sizes="150px"
                      priority={index === 0}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="product-details-section">
          <div className="product-divider"></div>

          <div className="product-title-price-row">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-price">
              {selectedVariant ? (
                formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
              ) : (
                formatPrice(product.variants.edges[0]?.node.price.amount || '0', 'USD')
              )}
            </div>
          </div>

          {product.description && (
            <div className="product-description">
              {formatDescription(product.description).split('\n\n').map((paragraph, index) => (
                <p key={index} className="description-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Product Options */}
          {product.options.map(option => (
            <div key={option.id} className="product-option">
              <label className="option-label">{option.name}</label>
              <div className="option-values">
                {option.values.map(value => (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    className={`option-value ${selectedOptions[option.name] === value ? 'selected' : ''}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}


          {/* Add to Cart and Checkout Buttons */}
          <div className="product-buttons-container">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale || cartLoading}
              className={`add-to-cart-button ${!selectedVariant?.availableForSale ? 'disabled' : ''}`}
            >
              {cartLoading ? 'Adding...' : 
               !selectedVariant?.availableForSale ? 'Out of Stock' : 
               'Add to Cart'}
            </button>
            <button
              onClick={handleCheckout}
              disabled={!selectedVariant?.availableForSale || checkoutLoading}
              className={`checkout-button ${!selectedVariant?.availableForSale ? 'disabled' : ''}`}
            >
              {checkoutLoading ? 'Processing...' : 
               !selectedVariant?.availableForSale ? 'Out of Stock' : 
               'Checkout'}
            </button>
          </div>

          {/* Size Chart Button */}
          <button 
            className="size-chart-button"
            onClick={() => setIsSizeChartOpen(true)}
          >
            Size Chart
          </button>

        </div>
      </div>

      {/* Related Products Section */}
      <div className="related-products-section">
        <div className="related-products-container">
          <h2 className="related-products-title">Related Products</h2>
          {relatedLoading ? (
            <p>Loading related products...</p>
          ) : relatedProducts.length > 0 ? (
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  href={`/products/${relatedProduct.handle}`}
                  className="related-product-card"
                >
                  <div className="related-product-image">
                    {relatedProduct.images.edges[0]?.node && (
                      <Image
                        src={relatedProduct.images.edges[0].node.url}
                        alt={relatedProduct.images.edges[0].node.altText || relatedProduct.title}
                        width={300}
                        height={300}
                        className="related-product-img"
                      />
                    )}
                  </div>
                  <div className="related-product-info">
                    <h3 className="related-product-title">{relatedProduct.title}</h3>
                    <p className="related-product-price">
                      {formatPrice(
                        relatedProduct.priceRange.minVariantPrice.amount,
                        relatedProduct.priceRange.minVariantPrice.currencyCode
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <p>No related products found.</p>
              <p>Debug: relatedProducts.length = {relatedProducts.length}</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      
      {/* Size Chart Modal */}
      <SizeChartModal 
        isOpen={isSizeChartOpen} 
        onClose={() => setIsSizeChartOpen(false)}
        productType={(() => {
          const isShirt = handle?.includes('shirt') || handle?.includes('tee') || handle?.includes('t-shirt') || handle?.includes('bruce-lee-t') || handle?.endsWith('-t');
          console.log('🔍 Product handle:', handle);
          console.log('🔍 Product title:', product?.title);
          console.log('🔍 Is shirt?', isShirt);
          console.log('🔍 Product type:', isShirt ? 'shirt' : 'sweatpants');
          return isShirt ? 'shirt' : 'sweatpants';
        })()}
      />
    </div>
  );
}
