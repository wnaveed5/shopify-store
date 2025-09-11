'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createCart, getCart, updateCartLines, removeCartLines, addCartLines } from '@/lib/shopify';

export interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  uniqueKey?: string; // Unique identifier for variant + size combination
}

interface CartContextType {
  items: CartItem[];
  cartId: string | null;
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  checkoutUrl: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('shopify-cart-id');
    console.log('=== CART CONTEXT INITIALIZATION ===');
    console.log('Saved cart ID from localStorage:', savedCartId);
    
    if (savedCartId) {
      setCartId(savedCartId);
      loadCart(savedCartId);
    } else {
      console.log('No saved cart ID found, starting with empty cart');
    }
  }, []);

  const loadCart = async (id: string) => {
    try {
      setIsLoading(true);
      console.log('=== LOADING CART ===');
      console.log('Loading cart with ID:', id);
      
      const response = await getCart(id);
      console.log('Cart response:', response);
      console.log('Cart response cart:', response.cart);
      
      if (response.cart && response.cart.lines && response.cart.lines.edges) {
        console.log('Cart found, processing items...');
        console.log('Cart lines:', response.cart.lines);
        console.log('Cart lines edges:', response.cart.lines?.edges);
        
        // Check if cart has items
        if (response.cart.lines.edges.length === 0) {
          console.log('Cart is empty, clearing local state');
          setItems([]);
          setCheckoutUrl(response.cart.checkoutUrl);
          return;
        }
        
        const cartItems = response.cart.lines.edges.map((edge: any) => {
          // Try multiple methods to get size
          let size = null;
          
          // Method 1: selectedOptions
          const sizeOption = edge.node.merchandise.selectedOptions?.find((option: any) => 
            option.name.toLowerCase() === 'size' || option.name.toLowerCase() === 'title'
          );
          size = sizeOption?.value;
          
          // Method 2: attributes
          if (!size) {
            const attrSize = edge.node.attributes?.find((attr: any) => 
              attr.key.toLowerCase() === 'size' || attr.key === 'Size'
            )?.value;
            size = attrSize;
          }
          
          // Method 3: variant title (sometimes the variant title IS the size)
          if (!size) {
            const variantTitle = edge.node.merchandise.title;
            if (variantTitle && ['S', 'M', 'L', 'XL', 'Small', 'Medium', 'Large', 'Extra Large'].includes(variantTitle)) {
              size = variantTitle;
            }
          }
          
          console.log('Processing cart item:', {
            title: edge.node.merchandise.product.title,
            variantTitle: edge.node.merchandise.title,
            finalSize: size,
            selectedOptions: edge.node.merchandise.selectedOptions,
            attributes: edge.node.attributes,
            allData: edge.node.merchandise
          });
          
          return {
            id: edge.node.id,
            variantId: edge.node.merchandise.id,
            title: edge.node.merchandise.product.title,
            price: parseFloat(edge.node.merchandise.price.amount),
            quantity: edge.node.quantity,
            image: edge.node.merchandise.product.images.edges[0]?.node.url,
            size: size,
            // Create a unique key for this cart item (variant + size)
            uniqueKey: `${edge.node.merchandise.id}-${size || 'default'}`,
          };
        });
        
        console.log('Processed cart items:', cartItems);
        setItems(cartItems);
        setCheckoutUrl(response.cart.checkoutUrl);
        
        // Save cart items to localStorage as backup
        localStorage.setItem('shopify-cart-backup', JSON.stringify({
          items: cartItems,
          checkoutUrl: response.cart.checkoutUrl,
          timestamp: Date.now()
        }));
        
        console.log('Cart items set in state and backed up to localStorage');
      } else {
        console.log('No cart found in response or cart is invalid');
        console.log('Clearing invalid cart from localStorage');
        // Clear invalid cart ID from localStorage
        localStorage.removeItem('shopify-cart-id');
        setCartId(null);
        setItems([]);
        setCheckoutUrl(null);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      console.log('Cart loading failed, clearing cart state');
      // Clear cart state on error
      localStorage.removeItem('shopify-cart-id');
      setCartId(null);
      setItems([]);
      setCheckoutUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (newItem: Omit<CartItem, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Check if Shopify credentials are available
      if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
        console.warn('Shopify credentials not found. Adding item to local cart only.');
        // Add to local state for testing
        const tempId = `temp-${Date.now()}`;
        const newCartItem: CartItem = {
          id: tempId,
          ...newItem,
        };
        setItems(prev => [...prev, newCartItem]);
        return;
      }
      
      if (!cartId) {
        console.log('No existing cart, creating new cart...');
        // Create new cart
        console.log('Creating new cart with item:', {
          merchandiseId: newItem.variantId,
          quantity: newItem.quantity,
          attributes: newItem.size ? [{ key: 'Size', value: newItem.size }] : undefined,
        });
        
        const response = await createCart([{
          merchandiseId: newItem.variantId,
          quantity: newItem.quantity,
          // No attributes needed since each size is a separate variant
        }]);
        
        console.log('Cart creation response:', response);
        
        if (response.cartCreate?.cart) {
          const cart = response.cartCreate.cart;
          console.log('Cart created successfully:', cart);
          setCartId(cart.id);
          localStorage.setItem('shopify-cart-id', cart.id);
          setCheckoutUrl(cart.checkoutUrl);
          
          const cartItems = cart.lines.edges.map((edge: any) => {
            // Try multiple methods to get size
            let size = null;
            
            // Method 1: selectedOptions
            const sizeOption = edge.node.merchandise.selectedOptions?.find((option: any) => 
              option.name.toLowerCase() === 'size' || option.name.toLowerCase() === 'title'
            );
            size = sizeOption?.value;
            
            // Method 2: attributes
            if (!size) {
              const attrSize = edge.node.attributes?.find((attr: any) => 
                attr.key.toLowerCase() === 'size' || attr.key === 'Size'
              )?.value;
              size = attrSize;
            }
            
            // Method 3: variant title (sometimes the variant title IS the size)
            if (!size) {
              const variantTitle = edge.node.merchandise.title;
              if (variantTitle && ['S', 'M', 'L', 'XL', 'Small', 'Medium', 'Large', 'Extra Large'].includes(variantTitle)) {
                size = variantTitle;
              }
            }
            
            return {
              id: edge.node.id,
              variantId: edge.node.merchandise.id,
              title: edge.node.merchandise.product.title,
              price: parseFloat(edge.node.merchandise.price.amount),
              quantity: edge.node.quantity,
              image: edge.node.merchandise.product.images.edges[0]?.node.url,
              size: size,
              uniqueKey: `${edge.node.merchandise.id}-${size || 'default'}`,
            };
          });
          console.log('Setting cart items:', cartItems);
          setItems(cartItems);
        } else {
          console.error('Cart creation failed:', response.cartCreate?.userErrors);
        }
      } else {
        console.log('Existing cart found, adding to existing cart...');
        // Add to existing cart
        const existingItem = items.find(item => 
          item.variantId === newItem.variantId && item.size === newItem.size
        );
        console.log('Existing item check:', existingItem);
        
        if (existingItem) {
          console.log('Item already exists, updating quantity...');
          // Update quantity
          await updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity);
        } else {
          console.log('New item, adding to existing cart...');
          // Add new line item to existing cart using cartLinesAdd
          console.log('Using cartLinesAdd to add item to existing cart...');
          
          const cartLineInput = {
            merchandiseId: newItem.variantId,
            quantity: newItem.quantity,
            // No attributes needed since each size is a separate variant
          };
          
          console.log('Calling addCartLines with:', {
            cartId,
            lines: [cartLineInput]
          });
          
          const response = await addCartLines(cartId, [cartLineInput]);
          
          console.log('Add to existing cart response:', response);
          console.log('CartLinesAdd cart:', response.cartLinesAdd?.cart);
          console.log('CartLinesAdd userErrors:', response.cartLinesAdd?.userErrors);
          
          if (response.cartLinesAdd?.cart) {
            console.log('Item added successfully, reloading cart...');
            console.log('New cart ID from cartLinesAdd:', response.cartLinesAdd.cart.id);
            
            // Check if the cart ID has changed
            const newCartId = response.cartLinesAdd.cart.id;
            if (newCartId !== cartId) {
              console.log('Cart ID changed, updating cart ID:', newCartId);
              setCartId(newCartId);
              localStorage.setItem('shopify-cart-id', newCartId);
            }
            
            await loadCart(newCartId);
          } else {
            console.error('Failed to add item to cart. Full response:', response);
            console.error('User errors:', response.cartLinesAdd?.userErrors);
            console.error('Cart data:', response.cartLinesAdd?.cart);
            
            // Log the specific item being added for debugging
            console.error('Item that failed to add:', {
              merchandiseId: newItem.variantId,
              quantity: newItem.quantity,
              attributes: newItem.size ? [{ key: 'Size', value: newItem.size }] : undefined,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      console.error('Error details:', error);
      // Fallback: add to local state
      const tempId = `temp-${Date.now()}`;
      const newCartItem: CartItem = {
        id: tempId,
        ...newItem,
      };
      console.log('Adding fallback item to local cart:', newCartItem);
      setItems(prev => {
        const updated = [...prev, newCartItem];
        console.log('Fallback cart items:', updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cartId) return;
    
    try {
      setIsLoading(true);
      await removeCartLines(cartId, [lineId]);
      await loadCart(cartId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    
    try {
      setIsLoading(true);
      await updateCartLines(cartId, [{ id: lineId, quantity }]);
      await loadCart(cartId);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setItems([]);
    setCartId(null);
    setCheckoutUrl(null);
    localStorage.removeItem('shopify-cart-id');
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartId,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        checkoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
