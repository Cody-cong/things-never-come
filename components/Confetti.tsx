"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  /** 持续时间（毫秒），默认 3000 */
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  life: number;
}

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

/** 轻量 Canvas 礼花效果，无需第三方依赖 */
export default function Confetti({ duration = 3000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx?.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const particleCount = 80;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
      const speed = 3 + Math.random() * 6;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 6 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    }

    let raf = 0;
    const startTime = Date.now();

    function animate() {
      if (!ctx || !canvas) return;
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.vy += 0.15; // 重力
        p.vx *= 0.99; // 阻力
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.life = Math.max(0, 1 - progress);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[80]"
      aria-hidden="true"
    />
  );
}
