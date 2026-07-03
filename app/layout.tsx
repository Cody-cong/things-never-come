import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/lib/cart-context";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "GoodsNeverCome - 购物版多巴胺",
  description: "网购全流程模拟，商品永远不会到达",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppProviders>
          <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-cream shadow-phone">
            <main className="flex flex-1 flex-col overflow-x-hidden">{children}</main>
            <BottomNav />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
