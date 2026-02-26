/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/projects/[id]/exports": ["./assets/fonts/**"],
    },
  },
};

module.exports = nextConfig;
