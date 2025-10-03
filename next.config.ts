import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Produce a fully static export (HTML/CSS/JS) so the site can be hosted on any static server.
  output: 'export',
  // When hosting on GitHub Pages under a project site (https://<user>.github.io/<repo>/)
  // we need to set basePath and assetPrefix so the runtime looks up assets under the repo path.
  basePath: '/dilware-myself-frontend-web-fecha-hora-clima',
  assetPrefix: '/dilware-myself-frontend-web-fecha-hora-clima',
  /* config options here */
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
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
