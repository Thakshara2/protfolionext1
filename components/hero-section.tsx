'use client';

import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Monetizable Short-Form Videos
        <br />
        <span className="text-primary">That Generate $10K+ Monthly</span>
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Professional short-form content optimized for TikTok Creativity Program and YouTube Shorts monetization.
      </motion.p>
    </motion.div>
  );
};

export default HeroSection; 