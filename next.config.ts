import type { NextConfig } from 'next';

// Only existing public URLs with a meaningful replacement get redirects.
// Deleted account, internal and finance tools intentionally return 404.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/service', destination: '/services', permanent: true },
      { source: '/service/residential-painting', destination: '/services/interior-painting', permanent: true },
      { source: '/painting-room-in-garland-painter', destination: '/services/interior-painting', permanent: true },
      { source: '/our-work', destination: '/#our-work', permanent: true },
      { source: '/reviews', destination: '/#reviews', permanent: true },
      { source: '/booking', destination: '/contact', permanent: true },
      { source: '/get-painting-estimate-in-minutes', destination: '/contact', permanent: true },
    ];
  },
};
export default nextConfig;
