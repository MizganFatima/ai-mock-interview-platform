/** @type {import('Next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:50000/api/:path*', // Yahan 5000 ki jagah 50000 kar dein
      },
    ];
  },
};

module.exports = nextConfig;