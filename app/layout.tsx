import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "things never come - 购物版多巴胺",
  description: "网购全流程模拟，商品永远不会到达",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF8F0",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppProviders>
          <div className="flex min-h-screen flex-col bg-cream">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
