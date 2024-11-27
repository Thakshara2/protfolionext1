'use client';

import { motion } from "framer-motion";
import { DollarSign, Users, Video, Star } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    value: "10K+",
    label: "Monthly Revenue",
  },
  {
    icon: Users,
    value: "1M+",
    label: "Total Followers",
  },
  {
    icon: Video,
    value: "500+",
    label: "Videos Created",
  },
  {
    icon: Star,
    value: "100%",
    label: "Client Satisfaction",
  }
];

const StatsSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 py-16">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center text-center p-6 rounded-lg bg-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <stat.icon className="w-8 h-8 mb-4 text-primary" />
          <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
          <p className="text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsSection; 