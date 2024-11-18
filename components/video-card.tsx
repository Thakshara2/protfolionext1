'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Heart, Eye, Play, Pause, Volume2, VolumeX, Loader2, Share2, MessageCircle } from 'lucide-react';
import type { Video } from '@/hooks/use-videos';
import { useVideoCache } from '@/hooks/use-video-cache';
import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';

interface VideoCardProps {
  video: Video;
}

const VideoCard: FC<VideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string>(video.videoUrl);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { getCachedVideo, fetchAndCacheVideo } = useVideoCache(video.videoUrl);

  // Detect mobile device
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Intersection Observer for autoplay
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: isMobile ? 0.6 : 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          // Video is in view
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                // Start video from beginning when coming into view
                videoRef.current!.currentTime = 0;
              })
              .catch(error => {
                if (error.name === "NotAllowedError" && !isMuted) {
                  // If autoplay is blocked, mute and try again
                  setIsMuted(true);
                  videoRef.current!.muted = true;
                  videoRef.current!.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.log("Autoplay failed even when muted:", e));
                }
              });
          }
        } else {
          // Video is out of view
          videoRef.current.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile, isMuted]);

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const togglePlayPause = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            if (error.name === "NotAllowedError" && !isMuted) {
              setIsMuted(true);
              videoRef.current!.muted = true;
              videoRef.current!.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log("Playback failed even when muted:", e));
            }
          });
      }
    }
  };

  return (
    <motion.div 
      ref={intersectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-md mx-auto group"
    >
      <Card className="relative overflow-hidden rounded-2xl border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl">
        <AspectRatio ratio={9/16}>
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
          
          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30"
              >
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                  <div className="absolute inset-0 animate-pulse bg-white/10 rounded-full blur-xl" />
                </div>
                <div className="mt-4 text-sm font-medium text-white/90">
                  {loadingProgress > 0 ? `${Math.round(loadingProgress)}%` : 'Loading...'}
                </div>
                <div className="mt-2 w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Player */}
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute h-full w-full object-cover transition-transform duration-700"
            style={{ transform: isPlaying ? 'scale(1.05)' : 'scale(1)' }}
            loop
            playsInline
            muted={isMuted}
            preload="metadata"
            onClick={togglePlayPause}
            onLoadedMetadata={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            onError={(e) => console.error("Video loading error:", e)}
          />

          {/* Controls Overlay */}
          <AnimatePresence>
            {(showControls || isHovered) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col justify-between p-4"
              >
                {/* Top Controls */}
                <div className="flex justify-between items-start">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex flex-col items-start"
                  >
                    <h3 className="text-lg font-bold text-white shadow-sm">
                      {video.title}
                    </h3>
                  </motion.div>
                  
                  <motion.button
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                      if (videoRef.current) videoRef.current.muted = !isMuted;
                    }}
                    className="rounded-full bg-black/50 p-2.5 backdrop-blur-sm transition-all hover:bg-black/70"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-white" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Center Play Button */}
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlayPause}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 p-4 backdrop-blur-md transition-all hover:bg-white/30"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white" />
                  )}
                </motion.button>

                {/* Bottom Controls */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-white/90">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">{video.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/90">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{video.likes}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20"
                    >
                      <MessageCircle className="h-4 w-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20"
                    >
                      <Share2 className="h-4 w-4 text-white" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </AspectRatio>
      </Card>
    </motion.div>
  );
};

export default VideoCard;