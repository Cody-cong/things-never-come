import Link from "next/link";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "/", label: "首页" },
  { href: "/category", label: "分类" },
  { href: "/profile", label: "我的" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-ink/5 bg-white">
      <div className="mx-auto max-w-site px-6 py-12 md:px-8">
        <div className="flex flex-col items-center gap-6">
          <Logo size={36} showTagline={false} />
          <p className="max-w-md text-center text-sm text-muted">
            一个为剁手党开发的虚拟购物模拟器，灵感源自网站
            <a
              href="https://foodnevercome.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              https://foodnevercome.com
            </a>
            。
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted transition hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted/70">
            © {new Date().getFullYear()} things never come. 仅供娱乐，不发货。
          </p>
        </div>
      </div>
    </footer>
  );
}
