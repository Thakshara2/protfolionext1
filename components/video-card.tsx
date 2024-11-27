'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Heart, Eye, Play, Pause, Volume2, VolumeX, Loader2, Share2, MessageCircle } from 'lucide-react';
import type { Video } from '@/hooks/use-videos';
import { useVideoCache } from '@/hooks/use-video-cache';
import type { FC } from 'react';
import { useState, useRef, useEffect, memo } from 'react';

interface VideoCardProps {
  video: Video;
  onVisibilityChange?: (isVisible: boolean) => void;
}

const VideoCard: FC<VideoCardProps> = memo(({ video, onVisibilityChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for better autoplay
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { getCachedVideo, fetchAndCacheVideo } = useVideoCache(video.videoUrl);

  // Load video source with proper caching
  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Try to get cached video first
        let src = getCachedVideo();
        if (!src) {
          setIsLoading(true);
          src = await fetchAndCacheVideo();
        }
        setVideoSrc(src);
      } catch (error) {
        console.error('Error loading video:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [video.videoUrl]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768);
    };
    
    checkMobile();
    const debouncedResize = debounce(checkMobile, 250);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  // Intersection Observer with optimized thresholds
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '50px 0px',
      threshold: [0.5, 0.8],
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!videoRef.current) return;

        const isVisible = entry.intersectionRatio >= 0.8;
        onVisibilityChange?.(isVisible);

        if (isVisible && !isPlaying) {
          handlePlay();
        } else if (!isVisible && isPlaying) {
          handlePause();
        }
      });
    }, options);

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying]);

  // Optimized play/pause handlers
  const handlePlay = async () => {
    if (!videoRef.current || isPlaying) return;

    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback failed:', error);
      if (!isMuted) {
        setIsMuted(true);
        videoRef.current.muted = true;
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.error('Muted playback failed:', e);
        }
      }
    }
  };

  const handlePause = () => {
    if (!videoRef.current || !isPlaying) return;
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayPause = async (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      handlePause();
    } else {
      await handlePlay();
    }
  };

  // Progress tracking
  useEffect(() => {
    if (!videoRef.current) return;

    const handleProgress = () => {
      if (!videoRef.current || !videoRef.current.duration) return;
      const progress = (videoRef.current.buffered.length > 0)
        ? (videoRef.current.buffered.end(0) / videoRef.current.duration) * 100
        : 0;
      setLoadingProgress(progress);
    };

    videoRef.current.addEventListener('progress', handleProgress);
    return () => videoRef.current?.removeEventListener('progress', handleProgress);
  }, []);

  // Error handling and retry mechanism
  const handleVideoError = async () => {
    setHasError(true);
    setIsLoading(false);
    // Attempt to reload video after error
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  if (hasError) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <Card className="p-4 text-center text-red-500">
          <p>Failed to load video. Please try again later.</p>
        </Card>
      </div>
    );
  }

  // Rest of the component remains the same...
  return (
    <motion.div 
      ref={intersectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-md mx-auto group"
    >
      <Card className="group relative overflow-hidden rounded-xl border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl">
        <AspectRatio ratio={9/16}>
          {/* Video Player with optimized attributes */}
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute h-full w-full object-cover transition-transform duration-700"
            style={{ transform: isPlaying ? 'scale(1.05)' : 'scale(1)' }}
            loop
            playsInline
            muted={isMuted}
            preload="metadata"
            poster={video.thumbnail}
            onClick={togglePlayPause}
            onLoadedMetadata={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            onError={handleVideoError}
          />
          
          {/* Loading and controls overlays remain the same... */}
        </AspectRatio>
      </Card>
    </motion.div>
  );
});

// Utility function for debouncing
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

VideoCard.displayName = 'VideoCard';

export default VideoCard;