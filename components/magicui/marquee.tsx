"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ className, children, pauseOnHover, reverse, fade, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex w-full overflow-hidden", className)}
        {...props}
      >
        <motion.div
          className="flex min-w-full shrink-0 gap-4 py-4"
          animate={{
            x: reverse ? ["0%", "100%"] : ["-100%", "0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.div>
        <motion.div
          className="flex min-w-full shrink-0 gap-4 py-4"
          animate={{
            x: reverse ? ["0%", "100%"] : ["-100%", "0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.div>
      </div>
    );
  }
);

Marquee.displayName = "Marquee";

export default Marquee; 