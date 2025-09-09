import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Shopify configuration
const shopifyConfig = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || '2025-01',
};

// Create Shopify Storefront API client
export const shopifyClient = createStorefrontApiClient({
  storeDomain: shopifyConfig.storeDomain,
  apiVersion: shopifyConfig.apiVersion,
  publicAccessToken: shopifyConfig.storefrontAccessToken,
});

// GraphQL queries
export const QUERIES = {
  // Get all products
  GET_PRODUCTS: `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 1) {
              edges {
                node {
                  url(transform: {maxWidth: 400, maxHeight: 400})
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  // Get single product by handle
  GET_PRODUCT_BY_HANDLE: `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        images(first: 5) {
          edges {
            node {
              url(transform: {maxWidth: 600, maxHeight: 600})
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  `,

  // Get collections
  GET_COLLECTIONS: `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `,

  // Create cart
  CREATE_CART: `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          createdAt
          updatedAt
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url(transform: {maxWidth: 200, maxHeight: 200})
                            altText
                          }
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  // Get cart
  GET_CART: `
    query getCart($id: ID!) {
      cart(id: $id) {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
              attributes {
                key
                value
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        checkoutUrl
      }
    }
  `,

  // Update cart lines
  UPDATE_CART_LINES: `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url(transform: {maxWidth: 200, maxHeight: 200})
                            altText
                          }
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  // Add cart lines
  ADD_CART_LINES: `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url(transform: {maxWidth: 200, maxHeight: 200})
                            altText
                          }
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  // Remove cart lines
  REMOVE_CART_LINES: `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url(transform: {maxWidth: 200, maxHeight: 200})
                            altText
                          }
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
};

// Helper functions
export async function fetchProducts(first: number = 20) {
  try {
    const response = await shopifyClient.request(QUERIES.GET_PRODUCTS, {
      variables: { first },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function fetchProductByHandle(handle: string) {
  try {
    const response = await shopifyClient.request(QUERIES.GET_PRODUCT_BY_HANDLE, {
      variables: { handle },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function fetchCollections(first: number = 10) {
  try {
    const response = await shopifyClient.request(QUERIES.GET_COLLECTIONS, {
      variables: { first },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

export async function createCart(lineItems: Array<{ merchandiseId: string; quantity: number; attributes?: Array<{ key: string; value: string }> }>) {
  try {
    const response = await shopifyClient.request(QUERIES.CREATE_CART, {
      variables: {
        input: {
          lines: lineItems,
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

export async function getCart(cartId: string) {
  try {
    const response = await shopifyClient.request(QUERIES.GET_CART, {
      variables: { id: cartId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

export async function addCartLines(cartId: string, lines: Array<{ merchandiseId: string; quantity: number; attributes?: Array<{ key: string; value: string }> }>) {
  try {
    console.log('=== ADD_CART_LINES API CALL ===');
    console.log('Cart ID:', cartId);
    console.log('Lines to add:', lines);
    console.log('Query:', QUERIES.ADD_CART_LINES);
    
    const response = await shopifyClient.request(QUERIES.ADD_CART_LINES, {
      variables: {
        cartId,
        lines,
      },
    });
    
    console.log('Raw API response:', response);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error adding cart lines:', error);
    console.error('Error details:', error);
    throw error;
  }
}

export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
  try {
    const response = await shopifyClient.request(QUERIES.UPDATE_CART_LINES, {
      variables: {
        cartId,
        lines,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart lines:', error);
    throw error;
  }
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  try {
    const response = await shopifyClient.request(QUERIES.REMOVE_CART_LINES, {
      variables: {
        cartId,
        lineIds,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing cart lines:', error);
    throw error;
  }
}

// Create cart and get checkout URL for direct checkout
export async function createCartAndGetCheckoutUrl(lineItems: Array<{ merchandiseId: string; quantity: number; attributes?: Array<{ key: string; value: string }> }>) {
  try {
    const response = await shopifyClient.request(QUERIES.CREATE_CART, {
      variables: {
        input: {
          lines: lineItems,
        },
      },
    });
    
    if (response.data?.cartCreate?.cart?.checkoutUrl) {
      return response.data.cartCreate.cart.checkoutUrl;
    } else {
      throw new Error('No checkout URL returned from cart creation');
    }
  } catch (error) {
    console.error('Error creating cart for checkout:', error);
    throw error;
  }
}
