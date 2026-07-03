"use client";

import { useEffect, useRef } from "react";
import { Bike, Store, Home } from "lucide-react";

interface DeliveryMapProps {
  progress: number; // 0 -> 1
}

// Curvy S-shaped route inside a 400x240 viewBox.
// Start (shop) at bottom-left, end (home) at top-right.
const PATH_D =
  "M 24 200 C 100 160, 60 80, 180 120 S 300 180, 240 100 S 340 40, 376 40";

const VIEW_W = 400;
const VIEW_H = 240;

export default function DeliveryMap({ progress }: DeliveryMapProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const courierRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const courier = courierRef.current;
    if (!path || !courier) return;

    const totalLen = path.getTotalLength();
    const p = Math.min(Math.max(progress, 0), 1);
    const point = path.getPointAtLength(totalLen * p);

    // Convert viewBox coords to percentage of container.
    // Container has aspect-[400/240] so percentages map linearly.
    courier.style.left = `${(point.x / VIEW_W) * 100}%`;
    courier.style.top = `${(point.y / VIEW_H) * 100}%`;
  }, [progress]);

  return (
    <div className="mx-4 mt-3 overflow-hidden rounded-3xl bg-mint shadow-card">
      <div className="relative w-full aspect-[400/240]">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
        >
          {/* Decorative buildings (soft sand tones) */}
          <rect x="50" y="36" width="26" height="34" rx="6" fill="#E8DCC8" />
          <rect x="300" y="160" width="22" height="30" rx="5" fill="#E8DCC8" />
          <rect x="170" y="180" width="24" height="32" rx="5" fill="#F0E6D6" />
          <rect x="330" y="60" width="20" height="26" rx="5" fill="#F0E6D6" />

          {/* Decorative trees (soft mint green) */}
          <circle cx="120" cy="56" r="5" fill="#C8E0C8" />
          <circle cx="350" cy="200" r="5" fill="#C8E0C8" />
          <circle cx="260" cy="48" r="4" fill="#C8E0C8" />
          <circle cx="90" cy="150" r="4" fill="#C8E0C8" />

          {/* Route: accent-light base + white dashed center line */}
          <path
            d={PATH_D}
            fill="none"
            stroke="#F6E0D8"
            strokeWidth={8}
            strokeLinecap="round"
          />
          <path
            d={PATH_D}
            fill="none"
            stroke="#ffffff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="2 6"
          />

          {/* Path reference for getPointAtLength */}
          <path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke="transparent"
            strokeWidth={0}
          />
        </svg>

        {/* Start marker - shop */}
        <div
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white shadow-md"
          style={{ left: `${(24 / VIEW_W) * 100}%`, top: `${(200 / VIEW_H) * 100}%` }}
        >
          <Store size={16} />
        </div>

        {/* End marker - home (soft green) */}
        <div
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-400 text-white shadow-md"
          style={{ left: `${(376 / VIEW_W) * 100}%`, top: `${(40 / VIEW_H) * 100}%` }}
        >
          <Home size={16} />
        </div>

        {/* Courier - position driven by progress via ref */}
        <div
          ref={courierRef}
          className="absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-accent"
          style={{ left: `${(24 / VIEW_W) * 100}%`, top: `${(200 / VIEW_H) * 100}%` }}
        >
          <Bike size={18} className="text-accent" />
        </div>
      </div>
    </div>
  );
}
