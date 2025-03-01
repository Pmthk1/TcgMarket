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
        hostname: "your-supabase-project.supabase.co", // 🔹 แก้เป็นโดเมนของ Supabase ของคุณ
      },
      {
        protocol: "https",
        hostname: "promptpay.io",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
