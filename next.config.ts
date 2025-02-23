/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "xyz.supabase.co", // เปลี่ยนเป็นโดเมนของ Supabase ของคุณ
      },
    ],
  },
};

export default nextConfig;
