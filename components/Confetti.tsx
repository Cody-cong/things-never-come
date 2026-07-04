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

/** DOM + CSS 礼花效果，无需 canvas，兼容性更好 */
export default function Confetti() {
  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: 60 }, () => ({
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
            } as React.CSSProperties
          }
        />
      ))}
      <style jsx>{`
        .confetti-piece {
          position: absolute;
          top: -20px;
          border-radius: 2px;
          animation-name: confetti-fall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
          transform: rotate(var(--rotate));
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(var(--rotate));
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(var(--drift))
              rotate(calc(var(--rotate) + 720deg));
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
