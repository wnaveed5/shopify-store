// GIF synchronization utility
export class GifSync {
  private static instance: GifSync;
  private gifs: HTMLImageElement[] = [];
  private isPlaying = false;
  private startTime = 0;

  static getInstance(): GifSync {
    if (!GifSync.instance) {
      GifSync.instance = new GifSync();
    }
    return GifSync.instance;
  }

  // Register a GIF for synchronization
  registerGif(img: HTMLImageElement): void {
    if (img.src.toLowerCase().includes('.gif') || img.src.toLowerCase().includes('.webp')) {
      this.gifs.push(img);
      
      // Pause the GIF initially
      this.pauseGif(img);
    }
  }

  // Pause a GIF by reloading it
  private pauseGif(img: HTMLImageElement): void {
    const originalSrc = img.src;
    // Add a cache-busting parameter to force reload
    img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 't=' + Date.now();
    
    // Store original src for later
    (img as any).originalSrc = originalSrc;
  }

  // Start all registered GIFs simultaneously
  startAllGifs(): void {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.startTime = Date.now();
    
    // Reload all GIFs at the same time to sync them
    this.gifs.forEach(gif => {
      if ((gif as any).originalSrc) {
        gif.src = (gif as any).originalSrc;
      }
    });
  }

  // Reset all GIFs to paused state
  resetAllGifs(): void {
    this.isPlaying = false;
    this.gifs.forEach(gif => {
      this.pauseGif(gif);
    });
  }

  // Clear all registered GIFs
  clearGifs(): void {
    this.gifs = [];
    this.isPlaying = false;
  }

  // Get the current playback state
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

// Auto-start GIFs when page is ready
export function initializeGifSync(): void {
  const gifSync = GifSync.getInstance();
  
  // Start GIFs after a short delay to ensure all are loaded
  setTimeout(() => {
    gifSync.startAllGifs();
  }, 100);
}

// Reset GIFs when navigating away
export function resetGifSync(): void {
  const gifSync = GifSync.getInstance();
  gifSync.resetAllGifs();
}
