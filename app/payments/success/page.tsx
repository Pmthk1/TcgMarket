"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <div className="relative flex items-start justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-20"
      >
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-[380px] md:w-[420px] text-center">
          {/* ✅ ครอบด้วย flex justify-center ให้ไอคอนอยู่ตรงกลาง */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex justify-center mt-4"
          >
            <Image src="/images/success-icon.png" alt="Success" width={90} height={90} className="block mx-auto" />
          </motion.div>

          <h2 className="text-2xl font-bold text-green-600 mt-5">การชำระเงินสำเร็จ</h2>
          <p className="text-gray-700 mt-2 text-lg">ขอบคุณสำหรับการสั่งซื้อของคุณ</p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-6"
          >
            <Image
              src="/images/anime3.png"
              alt="Anime Celebration"
              width={230}
              height={230}
              className="mx-auto"
            />
          </motion.div>

          <Button
            className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-xl font-bold transition-all duration-300 shadow-lg"
            onClick={() => router.push("/")}
          >
            กลับไปหน้าหลัก
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
