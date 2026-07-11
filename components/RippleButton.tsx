"use client";

import {
  useRef,
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  rippleColor?: string;
}

const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  function RippleButton(
    {
      children,
      className = "",
      rippleColor = "rgba(255, 255, 255, 0.35)",
      onClick,
      ...props
    },
    ref
  ) {
    const innerRef = useRef<HTMLButtonElement>(null);

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
      const btn = (ref && "current" in ref ? ref.current : innerRef.current);
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.6;

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.backgroundColor = rippleColor;

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      onClick?.(e);
    }

    return (
      <button
        ref={ref || innerRef}
        onClick={handleClick}
        className={`relative overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default RippleButton;
