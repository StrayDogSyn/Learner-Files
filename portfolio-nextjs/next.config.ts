/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages requires static export
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/Learner-Files' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Learner-Files/' : '',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable server-side features for static export
  experimental: {
    esmExternals: 'loose',
  },
  
  // Webpack configuration for static assets
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

export default nextConfig
