import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/hackathon', destination: '/hackathons', permanent: false },
      { source: '/hackathon/:id', destination: '/hackathons/:id', permanent: false },
      { source: '/project', destination: '/goat-hunt', permanent: false },
      { source: '/project/:id', destination: '/goat-hunt/:id', permanent: false },
      { source: '/projects', destination: '/goat-hunt', permanent: false },
      { source: '/projects/:id', destination: '/goat-hunt/:id', permanent: false },
      { source: '/badge', destination: '/badges', permanent: false },
      { source: '/badge/:id', destination: '/badges/:id', permanent: false },
      { source: '/info', destination: '/stories', permanent: false },
      { source: '/info/:slug', destination: '/stories/:slug', permanent: false },
      { source: '/news', destination: '/stories', permanent: false },
      { source: '/news/:slug', destination: '/stories/:slug', permanent: false },
    ];
  },
};

export default nextConfig;
