import { useEffect, useRef } from 'react';

interface CacheItem {
  blob: Blob;
  timestamp: number;
  url: string;
}

const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes
const MAX_CACHE_SIZE = 50; // Maximum number of videos to cache
const videoCache = new Map<string, CacheItem>();

export const useVideoCache = (videoUrl: string) => {
  const blobUrl = useRef<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const clearOldCache = () => {
    const now = Date.now();
    const entries = Array.from(videoCache.entries());
    
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove expired items and ensure we don't exceed max cache size
    entries.forEach(([url, item], index) => {
      if (now - item.timestamp > CACHE_EXPIRY || index >= MAX_CACHE_SIZE) {
        URL.revokeObjectURL(item.url);
        videoCache.delete(url);
      }
    });
  };

  const preloadVideo = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) throw new Error('Video preload check failed');
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Video preload failed:', error.message);
      } else {
        console.warn('Video preload failed with unknown error');
      }
    }
  };

  const fetchAndCacheVideo = async () => {
    try {
      // Cancel any existing fetch
      if (abortController.current) {
        abortController.current.abort();
      }
      
      abortController.current = new AbortController();
      
      const response = await fetch(videoUrl, {
        signal: abortController.current.signal,
        headers: {
          'Range': 'bytes=0-', // Support partial content
        }
      });

      if (!response.ok) throw new Error('Video fetch failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Clear old cache before adding new item
      clearOldCache();
      
      videoCache.set(videoUrl, { 
        blob, 
        timestamp: Date.now(),
        url 
      });

      if (blobUrl.current) {
        URL.revokeObjectURL(blobUrl.current);
      }
      blobUrl.current = url;

      return url;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Video fetch aborted');
        } else {
          console.error('Error caching video:', error.message);
        }
      } else {
        console.error('Unknown error while caching video');
      }
      throw error;
    }
  };

  const getCachedVideo = () => {
    const cached = videoCache.get(videoUrl);
    if (cached) {
      if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
        URL.revokeObjectURL(cached.url);
        videoCache.delete(videoUrl);
        return null;
      }
      return cached.url;
    }
    return null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
      if (blobUrl.current) {
        URL.revokeObjectURL(blobUrl.current);
      }
    };
  }, []);

  return {
    getCachedVideo,
    fetchAndCacheVideo,
    preloadVideo
  };
}; 