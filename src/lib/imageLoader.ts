interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Check if the image is a GIF
  const isGif = src.toLowerCase().includes('.gif');
  
  // For GIFs, return the original URL without optimization to preserve quality
  if (isGif) {
    return src;
  }
  
  // For Shopify images, use their built-in transformation API for better quality
  if (src.includes('cdn.shopify.com') || src.includes('.myshopify.com')) {
    // Use Shopify's transformation API with higher quality settings
    const params = new URLSearchParams();
    params.set('width', width.toString());
    params.set('quality', (quality || 95).toString());
    params.set('format', 'auto'); // Let Shopify choose the best format
    
    // Add the transformation parameters to the URL
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}${params.toString()}`;
  }
  
  // For local images, return as-is
  return src;
}
