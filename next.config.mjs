/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gxoibjaejbmathfpztjt.supabase.co",
      },
    ],
  },
};

export default nextConfig;
