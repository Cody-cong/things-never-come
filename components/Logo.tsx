import Link from "next/link";
import TakeoutBoxIcon from "@/components/TakeoutBoxIcon";

interface LogoProps {
  size?: number;
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
}

export default function Logo({
  size = 36,
  showTagline = true,
  className = "",
  asLink = true,
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <TakeoutBoxIcon size={size} />
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-accent">
          things never come
        </span>
        {showTagline && (
          <span className="text-[10px] font-semibold tracking-wide text-muted">
            Order Things. Get Nothing.
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
