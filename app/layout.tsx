import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html lang="zh-CN" className={spaceMono.variable}>
      <head>
        <link rel="preconnect" href="https://api.deepseek.com" />
        <link rel="dns-prefetch" href="https://api.deepseek.com" />
        <link rel="preconnect" href="https://trae-api-cn.mchost.guru" />
        <link rel="dns-prefetch" href="https://trae-api-cn.mchost.guru" />
        {SUPABASE_URL && (
          <>
            <link rel="preconnect" href={SUPABASE_URL} />
            <link rel="dns-prefetch" href={SUPABASE_URL} />
          </>
        )}
      </head>
      <body>
        <AppProviders>
          <ToastProvider>
            <div className="flex min-h-screen flex-col bg-cream">
              <Header />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
              <BottomNav />
            </div>
          </ToastProvider>
        </AppProviders>
      </body>
    </html>
  );
}
