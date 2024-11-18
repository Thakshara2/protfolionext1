import { useEffect, useRef } from 'react';

interface CacheItem {
  blob: Blob;
  timestamp: number;
}

const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes
const videoCache = new Map<string, CacheItem>();

export const useVideoCache = (videoUrl: string) => {
  const blobUrl = useRef<string | null>(null);

  const clearOldCache = () => {
    const now = Date.now();
    for (const [url, item] of videoCache.entries()) {
      if (now - item.timestamp > CACHE_EXPIRY) {
        if (blobUrl.current) {
          URL.revokeObjectURL(blobUrl.current);
        }
        videoCache.delete(url);
      }
    }
  };

  const fetchAndCacheVideo = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      videoCache.set(videoUrl, { blob, timestamp: Date.now() });
      if (blobUrl.current) {
        URL.revokeObjectURL(blobUrl.current);
      }
      blobUrl.current = URL.createObjectURL(blob);
      return blobUrl.current;
    } catch (error) {
      console.error('Error caching video:', error);
      return videoUrl;
    }
  };

  const getCachedVideo = () => {
    const cached = videoCache.get(videoUrl);
    if (cached) {
      if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
        videoCache.delete(videoUrl);
        return null;
      }
      if (blobUrl.current) {
        URL.revokeObjectURL(blobUrl.current);
      }
      blobUrl.current = URL.createObjectURL(cached.blob);
      return blobUrl.current;
    }
    return null;
  };

  useEffect(() => {
    clearOldCache();
    return () => {
      if (blobUrl.current) {
        URL.revokeObjectURL(blobUrl.current);
      }
    };
  }, []);

  return { getCachedVideo, fetchAndCacheVideo };
}; 