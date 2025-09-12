'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  // Custom props
  showLoadingSkeleton?: boolean;
  loadingText?: string;
  errorText?: string;
  // GIF handling
  preserveGifAnimation?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 95,
  sizes,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  showLoadingSkeleton = true,
  loadingText = 'Loading...',
  errorText = 'Failed to load image',
  preserveGifAnimation = true,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if the image is a GIF
  const isGif = src.toLowerCase().includes('.gif');

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);
    setImageLoaded(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Default blur placeholder for non-GIF images
  const defaultBlurDataURL = blurDataURL || (isGif ? undefined : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=");

  return (
    <div className={`optimized-image-container ${className}`} style={{ position: 'relative' }}>
      {/* Loading Skeleton */}
      {showLoadingSkeleton && isLoading && (
        <div className="image-loading-skeleton">
          <div className="skeleton-shimmer"></div>
          <span className="loading-text">{loadingText}</span>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="image-error-state">
          <div className="error-icon">⚠️</div>
          <span className="error-text">{errorText}</span>
        </div>
      )}

      {/* Actual Image */}
      {!hasError && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={`optimized-image ${imageLoaded ? 'loaded' : 'loading'} ${isGif ? 'gif-image' : ''}`}
          priority={priority}
          quality={quality}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
    </div>
  );
}
