'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType?: 'shirt' | 'sweatpants';
}

export default function SizeChartModal({ isOpen, onClose, productType = 'sweatpants' }: SizeChartModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="size-chart-modal-overlay" onClick={onClose}>
      <div className="size-chart-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="size-chart-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="size-chart-modal-header">
          <h2 className="size-chart-modal-title">Size Chart</h2>
        </div>
        
        <div className="size-chart-modal-body">
          <Image
            src={productType === 'shirt' ? "/images/Beige and Black Minimalist Size Chart Instagram Post.png" : "/images/Your paragraph text.png"}
            alt={productType === 'shirt' ? "Shirt Size Chart" : "Sweatpants Size Chart"}
            width={600}
            height={800}
            className="size-chart-image"
            priority
          />
        </div>
      </div>
    </div>
  );
}
