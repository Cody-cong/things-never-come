/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig = {
  // 开发模式下使用正常 SSR，避免 localStorage 动态商品 id 在 dev 时因 static export 报错
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  distDir: "out",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trae-api-cn.mchost.guru",
      },
    ],
  },
};

export default nextConfig;
