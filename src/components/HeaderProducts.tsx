'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts } from '@/lib/shopify';

interface Product {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
}

export default function HeaderProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(4); // Get first 4 products for header
        const productsList = data.products.edges.map((edge: { node: Product }) => edge.node);
        setProducts(productsList);
      } catch (err) {
        console.error('Error loading products for header:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="hmr-menu-products">
        <div className="hmr-menu-products-title">
          <Link href="/collections/shop">SHOP</Link>
        </div>
        <div className="hmr-menu-products-list-wrap">
          <ul className="hmr-menu-products-list scrolling">
            <li className="hmr-menu-products-item">
              <div className="loading-placeholder">Loading...</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="hmr-menu-products">
      <div className="hmr-menu-products-title">
        <Link href="/collections/shop">SHOP</Link>
      </div>
      <div className="hmr-menu-products-list-wrap">
        <ul className="hmr-menu-products-list scrolling">
          {products.map((product) => {
            const image = product.images.edges[0]?.node;
            return (
              <li key={product.id} className="hmr-menu-products-item">
                <Link href={`/products/${product.handle}`} tabIndex={-1}>
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      width={80}
                      height={80}
                      className="header-product-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="header-product-placeholder">
                      <span>{product.title}</span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <button aria-label="Scroll carousel left" className="hmr-menu-products-nav hmr-menu-products-nav--prev" type="button">
          <svg viewBox="0 0 100 100">
            <path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" aria-hidden="true" role="presentation"></path>
          </svg>
        </button>
        <button aria-label="Scroll carousel right" className="hmr-menu-products-nav hmr-menu-products-nav--next on" type="button">
          <svg viewBox="0 0 100 100">
            <path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" aria-hidden="true" role="presentation" transform="translate(100, 100) rotate(180) "></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
