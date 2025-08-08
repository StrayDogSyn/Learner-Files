import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/Learner-Files',
  assetPrefix: '/Learner-Files'
};

export default nextConfig;
