// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'web-production-9f3a.up.railway.app',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'web-production-9f3a.up.railway.app',
        pathname: '/media/**',
      },
    ],
  },
};