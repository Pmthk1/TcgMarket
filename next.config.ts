/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Clerk
      { protocol: "https", hostname: "img.clerk.com" },

      // ✅ Supabase public storage (ใช้ hostname ของโปรเจกต์คุณจริง ๆ)
      {
        protocol: "https",
        hostname: "zupzeynznuvdaqhmschv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },

      // PromptPay
      { protocol: "https", hostname: "promptpay.io" },

      // Local dev
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
