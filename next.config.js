/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === "production" ? "/svg-to-3d" : undefined,
  output: "export",
  reactStrictMode: true,
};

module.exports = nextConfig;
