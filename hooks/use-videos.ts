import { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, getMetadata, StorageReference } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface Video {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  views: string;
  likes: string;
  category: string;
}

export function useVideos(category: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        
        // Map categories to their respective folder paths
        const categoryFolders: { [key: string]: string } = {
          'quiz': 'Quiz',
          'reddit-stories': 'Reddit stories',
          'brain-teaser': 'Brain teaser',
          'lyrics': 'lyrics',
          'text-stories': 'text stories',
          'aura-quiz': 'Aura quiz'
        };

        // Get the correct folder path and try multiple variations if needed
        let folderPath = categoryFolders[category] || category;
        let folderRef = ref(storage, folderPath);
        let result;

        try {
          // Try the mapped path first
          result = await listAll(folderRef);
        } catch (err) {
          // If that fails, try lowercase
          folderPath = folderPath.toLowerCase();
          folderRef = ref(storage, folderPath);
          try {
            result = await listAll(folderRef);
          } catch (err) {
            // If that fails too, try the original category string
            folderRef = ref(storage, category);
            result = await listAll(folderRef);
          }
        }
        
        // Get all video files
        const videoFiles = result.items.filter(item => 
          item.name.toLowerCase().match(/\.(mp4|mov|avi|mkv|webm)$/i)
        );

        const videosData = await Promise.all(
          videoFiles.map(async (fileRef: StorageReference) => {
            try {
              const videoUrl = await getDownloadURL(fileRef);
              const metadata = await getMetadata(fileRef);

              // Generate view and like counts
              const viewCount = Math.floor(Math.random() * (1000000 - 10000) + 10000);
              const likeCount = Math.floor(viewCount * (Math.random() * 0.2 + 0.1));

              const formatNumber = (num: number) => {
                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
                if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
                return num.toString();
              };

              // Generate thumbnail URL from video URL
              // For Firebase Storage URLs, we'll use the video URL as the thumbnail
              // In a production environment, you should generate and store actual thumbnails
              const thumbnail = videoUrl;

              return {
                id: fileRef.name,
                title: metadata.customMetadata?.title || 
                       fileRef.name.replace(/\.[^/.]+$/, '')
                                 .replace(/_/g, ' ')
                                 .replace(/-/g, ' ')
                                 .replace(/tiktok textcube/gi, '')
                                 .trim(),
                videoUrl,
                thumbnail,
                views: formatNumber(viewCount),
                likes: formatNumber(likeCount),
                category
              };
            } catch (err) {
              console.error(`Error processing video ${fileRef.name}:`, err);
              return null;
            }
          })
        );

        // Filter out failed videos and sort by views
        const validVideos = videosData
          .filter((video): video is Video => video !== null)
          .sort((a, b) => {
            const aViews = parseFloat(a.views.replace(/[KM]/g, '')) * 
                          (a.views.includes('M') ? 1000000 : (a.views.includes('K') ? 1000 : 1));
            const bViews = parseFloat(b.views.replace(/[KM]/g, '')) * 
                          (b.views.includes('M') ? 1000000 : (b.views.includes('K') ? 1000 : 1));
            return bViews - aViews;
          });

        setVideos(validVideos);
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [category]);

  return { videos, loading, error };
} 