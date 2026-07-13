/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // escudos de clube vêm de content.data.ea.com
    remotePatterns: [
      { protocol: "https", hostname: "**.ea.com" },
      { protocol: "https", hostname: "**.easports.com" },
    ],
  },
};

module.exports = nextConfig;
