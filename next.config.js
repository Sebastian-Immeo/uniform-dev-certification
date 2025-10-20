/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*" }],
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
};

module.exports = nextConfig;
