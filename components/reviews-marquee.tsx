"use client";

import { cn } from "@/lib/utils";
import Marquee from "./magicui/marquee";

const reviews = [
  {
    name: "bairu_c",
    username: "United States",
    body: "First time with the service. The seller communicated great",
    img: "https://avatar.vercel.sh/bairu",
  },
  {
    name: "Michael R.",
    username: "United States",
    body: "Excellent quality and fast delivery. Will definitely order again!",
    img: "https://avatar.vercel.sh/michael",
  },
  {
    name: "Sarah K.",
    username: "United States",
    body: "Amazing work! The video quality exceeded my expectations.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "David W.",
    username: "United Kingdom",
    body: "Professional service and great attention to detail. Highly recommended!",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Emma S.",
    username: "United Kingdom",
    body: "Brilliant work! The final product was exactly what I wanted.",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "James B.",
    username: "United Kingdom",
    body: "Outstanding service! Communication was excellent throughout.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Sophie L.",
    username: "Canada",
    body: "Very impressed with the quality and professionalism.",
    img: "https://avatar.vercel.sh/sophie",
  },
  {
    name: "Lucas M.",
    username: "Canada",
    body: "Quick turnaround and excellent results. Will use again!",
    img: "https://avatar.vercel.sh/lucas",
  },
  {
    name: "Emily R.",
    username: "Canada",
    body: "Fantastic experience from start to finish. Highly satisfied!",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "Alex P.",
    username: "United States",
    body: "Great creativity and understanding of the brief. Perfect execution!",
    img: "https://avatar.vercel.sh/alex",
  },
  {
    name: "Oliver H.",
    username: "United Kingdom",
    body: "Exceeded expectations in every way. Truly professional service.",
    img: "https://avatar.vercel.sh/oliver",
  },
  {
    name: "Isabella C.",
    username: "Canada",
    body: "Amazing attention to detail and great communication throughout.",
    img: "https://avatar.vercel.sh/isabella",
  }
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
        "border-white/10 bg-white/5 hover:bg-white/10",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-white/70">{body}</blockquote>
    </figure>
  );
};

export function ReviewsMarquee() {
  const midPoint = Math.ceil(reviews.length / 2);
  const firstRow = [...reviews.slice(0, midPoint), ...reviews.slice(0, midPoint)];
  const secondRow = [...reviews.slice(midPoint), ...reviews.slice(midPoint)];

  return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden">
      <div className="mb-8 space-y-4 text-center">
        <h2 className="text-3xl font-bold">Client Reviews</h2>
        <p className="text-gray-400">What my clients say about my work</p>
      </div>
      <div className="relative w-full flex flex-col gap-4">
        <div className="flex w-full overflow-hidden">
          <Marquee pauseOnHover className="[--duration:40s]">
            {firstRow.map((review, index) => (
              <ReviewCard key={`${review.name}-${index}`} {...review} />
            ))}
          </Marquee>
        </div>
        <div className="flex w-full overflow-hidden">
          <Marquee reverse pauseOnHover className="[--duration:40s]">
            {secondRow.map((review, index) => (
              <ReviewCard key={`${review.name}-${index}`} {...review} />
            ))}
          </Marquee>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black"></div>
      </div>
    </div>
  );
} 