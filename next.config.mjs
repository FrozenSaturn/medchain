/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // reactStrictMode: true,
  //   assetPrefix: process.env.NODE_ENV === 'production' ? '/.' : '',
  //   output: 'export',
  //   trailingSlash: true,
}

export default nextConfig;
