'use client';

import { motion } from 'framer-motion';
import { Sparkles, Mic, Gamepad, Wand2, DollarSign, Youtube, BrainCircuit } from 'lucide-react';

const features = [
  {
    icon: <Mic className="h-6 w-6" />,
    title: "AI Voice Cloning",
    description: "Professional voiceovers using ElevenLabs AI with real voice cloning technology for authentic narration"
  },
  {
    icon: <Gamepad className="h-6 w-6" />,
    title: "Original Gameplay",
    description: "High-quality, original gameplay footage captured professionally for engaging background content"
  },
  {
    icon: <Wand2 className="h-6 w-6" />,
    title: "Custom Transitions",
    description: "Smooth, professional transitions and animations that enhance viewer engagement"
  },
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: "Original Content",
    description: "100% original content creation with no reused materials, ensuring uniqueness and authenticity"
  },
  {
    icon: <Youtube className="h-6 w-6" />,
    title: "Monetization Ready",
    description: "Optimized for TikTok Creator Program and YouTube Shorts monetization requirements"
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Proven Results",
    description: "Help clients earn up to $10,000 monthly through strategic content optimization"
  }
];

const FeatureCard = ({ icon, title, description, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:bg-white/10"
  >
    <div className="mb-4 inline-block rounded-lg bg-green-500/10 p-3 text-green-500">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
    <p className="text-sm text-white/70">{description}</p>
  </motion.div>
);

const FeaturesSection = () => {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70"
          >
            <Sparkles className="mr-2 h-4 w-4 text-green-500" />
            Why Choose Our Service
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-4xl font-bold text-white"
          >
            Professional Short-Form Content Creation
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-white/70"
          >
            Turn your content into a revenue stream with our expert video production
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <a
            href="https://fiverr.com/your_profile"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-green-500 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Hire me on Fiverr
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection; 