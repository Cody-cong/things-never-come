"use client";

interface BarcodeProps {
  value: string;
  className?: string;
}

export default function Barcode({ value, className }: BarcodeProps) {
  const chars = value.split("");
  const width = 240;
  const height = 48;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className ?? ""}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={`barcode ${value}`}
    >
      {chars.map((char, i) => {
        const code = char.charCodeAt(0);
        const x = (i / chars.length) * width;
        const barWidth = Math.max(2, ((code % 16) / 16) * (width / chars.length));
        return (
          <rect
            key={i}
            x={x}
            y={0}
            width={barWidth}
            height={height}
            fill="#2D1F1F"
          />
        );
      })}
    </svg>
  );
}
