/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['cdn.dummyjson.com'], // Deprecated: images.domains yerine images.remotePatterns kullan
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com', // Vercel Blob görselleri için
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

module.exports = nextConfig;
