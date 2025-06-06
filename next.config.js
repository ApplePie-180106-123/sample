/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 's.gravatar.com']
  },
  experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai']
  },
};

module.exports = nextConfig;