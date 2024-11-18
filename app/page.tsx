import VideoGrid from '@/components/video-grid'
import Navigation from '@/components/navigation'
import { ReviewsMarquee } from '@/components/reviews-marquee'
import { cn } from '@/lib/utils'
import FeaturesSection from '@/components/features-section'

export default function Home() {
  const categories = [
    { id: 'quiz', label: 'Viral Quizzes', platform: 'tiktok' },
    { id: 'reddit-stories', label: 'Reddit Stories', platform: 'youtube' },
    { id: 'brain-teaser', label: 'Brain Teasers', platform: 'tiktok' },
    { id: 'lyrics', label: 'Music Stories', platform: 'youtube' },
    { id: 'text-stories', label: 'Trending Stories', platform: 'tiktok' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <span className="text-lg font-medium">Content Creator</span>
          <a 
            href="https://www.fiverr.com/your_username" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-full bg-[#1DBF73] px-4 py-2 text-sm font-medium text-white hover:bg-[#19a463] transition-colors"
          >
            Hire Me on Fiverr
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 pt-32">
        <div className="mb-16 space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500">
              YouTube Shorts
            </span>
            <span className="inline-flex items-center rounded-full bg-pink-500/10 px-3 py-1 text-sm font-medium text-pink-500">
              TikTok
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Short-Form Video Creator
            <br />
            For Your Brand
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Specializing in viral short-form content across TikTok and YouTube Shorts.
            Over 1M+ combined views and growing audience engagement.
          </p>
        </div>

        <div className="mb-24">
          <ReviewsMarquee />
        </div>

        <Navigation categories={categories} />

        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="mb-24 scroll-mt-32"
          >
            <div className="flex items-center gap-2 mb-8">
              <h2 className="text-2xl font-semibold">{category.label}</h2>
              <span 
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  category.platform === 'tiktok' ? "bg-pink-500/10 text-pink-500" : "bg-red-500/10 text-red-500"
                )}
              >
                {category.platform === 'tiktok' ? 'TikTok' : 'YouTube'}
              </span>
            </div>
            <VideoGrid category={category.id} />
          </section>
        ))}

        <FeaturesSection />
      </div>

      <footer className="border-t border-white/10 bg-black/50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-gray-400">
            Professional Short-Form Video Creator on Fiverr
          </p>
        </div>
      </footer>
    </main>
  )
}