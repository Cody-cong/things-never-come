/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  distDir: "dist",
  basePath: isProd ? "/things-never-come" : "",
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
