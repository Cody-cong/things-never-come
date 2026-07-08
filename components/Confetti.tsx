"use client";

import { useMemo } from "react";

const COLORS = [
  "#ff6b6b",
  "#feca57",
  "#48dbfb",
  "#1dd1a1",
  "#5f27cd",
  "#ff9ff3",
  "#54a0ff",
  "#5cd859",
  "#ffa502",
  "#ee5a6f",
];

interface Piece {
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
  drift: number;
}

/** DOM + CSS 礼花效果，CSS 在 globals.css 中定义 */
export default function Confetti() {
  const pieces = useMemo<Piece[]>(() => {
    // 移动端减少粒子数量，降低 GPU 压力
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = isMobile ? 30 : 60;
    return Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.5 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 8 + Math.random() * 8,
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 200,
    }));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 0.5}px`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--rotate": `${p.rotate}deg`,
              "--drift": `${p.drift}px`,
              willChange: "transform, opacity",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
