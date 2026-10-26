/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['assets.coingecko.com', 'binance.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
