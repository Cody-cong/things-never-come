interface TakeoutBoxIconProps {
  size?: number;
  className?: string;
}

export default function TakeoutBoxIcon({
  size = 36,
  className = "",
}: TakeoutBoxIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M18 6C18 6 17 9 19 12C21 15 20 18 20 18"
        stroke="#D9534F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 4C24 4 23 8 25 11C27 14 26 17 26 17"
        stroke="#D9534F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M30 6C30 6 29 9 31 12C33 15 32 18 32 18"
        stroke="#D9534F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 22C16 22 20 18 24 18C28 18 32 22 32 22"
        stroke="#FADBD8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M18 26C18 26 22 22 26 22C30 22 34 26 34 26"
        stroke="#FADBD8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10 24L12 42C12 43.1046 12.8954 44 14 44H34C35.1046 44 36 43.1046 36 42L38 24H10Z"
        fill="#D9534F"
      />
      <path
        d="M8 22H40C41.1046 22 42 22.8954 42 24C42 25.1046 41.1046 26 40 26H8C6.89543 26 6 25.1046 6 24C6 22.8954 6.89543 22 8 22Z"
        fill="#B43E3A"
      />
      <path
        d="M16 26L18 42"
        stroke="#B43E3A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M32 26L30 42"
        stroke="#B43E3A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="19" cy="33" r="2" fill="#FFF8F0" />
      <circle cx="29" cy="33" r="2" fill="#FFF8F0" />
      <path
        d="M22 36C22 36 23 38 24 38C25 38 26 36 26 36"
        stroke="#FFF8F0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
