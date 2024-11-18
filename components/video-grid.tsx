'use client';

import { motion } from 'framer-motion';
import VideoCard from './video-card';
import { useVideos, type Video } from '@/hooks/use-videos';
import { Skeleton } from './ui/skeleton';
import type { FC } from 'react';

interface VideoGridProps {
  category: string;
}

const VideoGrid: FC<VideoGridProps> = ({ category }) => {
  const { videos, loading, error } = useVideos(category);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
          Failed to load videos. Please try again later.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="relative overflow-hidden rounded-xl">
            <div className="animate-pulse">
              <div className="aspect-[9/16] w-full bg-white/5">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="rounded-lg bg-white/5 p-4 text-white/70">
          No videos available in this category.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video: Video, index: number) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <VideoCard video={video} />
        </motion.div>
      ))}
    </div>
  );
};

export default VideoGrid;