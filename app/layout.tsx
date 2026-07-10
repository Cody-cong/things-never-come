import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "things never come - 购物版多巴胺",
  description: "网购全流程模拟，商品永远不会到达",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF8F0",
  viewportFit: "cover",
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://api.deepseek.com" />
        <link rel="dns-prefetch" href="https://api.deepseek.com" />
        {SUPABASE_URL && (
          <>
            <link rel="preconnect" href={SUPABASE_URL} />
            <link rel="dns-prefetch" href={SUPABASE_URL} />
          </>
        )}
      </head>
      <body>
        <AppProviders>
          <div className="flex min-h-screen flex-col bg-cream">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <BottomNav />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
