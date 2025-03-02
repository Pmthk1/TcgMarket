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
        hostname: "wwwdtcmxpfczpjschoqm.supabase.co",
      },
      {
        protocol: "https",
        hostname: "promptpay.io",
      },
      {
        protocol: "https",
        hostname: "example.com", // ✅ เพิ่มโดเมนที่มีปัญหา
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
