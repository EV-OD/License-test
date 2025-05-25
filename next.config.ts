import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // This site's primary language is English. Nepali content is loaded dynamically.
  output: 'export', // Added for static site generation
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Added for static export, as next/image optimization needs a server
  },
};

export default nextConfig;
