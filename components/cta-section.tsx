'use client';

import { Button } from "./ui/button";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <motion.div 
      className="bg-primary/5 py-20 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Your Content Journey?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Let's create engaging content that drives revenue and grows your audience.
        </p>
        <Button size="lg" className="text-lg px-8">
          Get Started
        </Button>
      </div>
    </motion.div>
  );
};

export default CTASection; 