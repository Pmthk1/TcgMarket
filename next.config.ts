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
      {
        protocol: "https",
        hostname: "promptpay.io", // ✅ เพิ่ม PromptPay
      },
    ],
    domains: ["localhost"], // ✅ อนุญาตให้โหลดภาพจาก localhost
  },
};

export default nextConfig;
