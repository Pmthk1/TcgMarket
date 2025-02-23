"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/context/CartContext"; // ✅ เพิ่ม useCart

const QRCodePage = () => {
  const router = useRouter();
  const { clearCart } = useCart(); // ✅ ใช้ clearCart

  const handlePaymentSuccess = () => {
    clearCart(); // ✅ ล้างตะกร้า
    router.push("/payments/success"); // ✅ ไปหน้าชำระเงินสำเร็จ
  };

  return (
    <div className="relative flex items-start justify-center h-screen bg-blue-50 p-6">
      <div className="absolute top-5 bg-white w-full max-w-md p-6 rounded-2xl shadow-xl text-center border border-gray-200">
        <h1 className="text-xl font-bold text-gray-700 mb-4">หน้าชำระเงิน</h1>

        {/* Thai QR Payment Logo */}
        <div className="flex justify-center mb-3">
          <Image
            src="/images/thai_qr_payment.png"
            alt="Thai QR Payment"
            width={250}
            height={80}
            className="rounded-md"
          />
        </div>

        {/* QR Code Section */}
        <div className="p-4">
          <Image
            src="/images/qrcode.png"
            alt="QR Code"
            width={200}
            height={200}
            className="mx-auto border border-gray-300 rounded-lg"
          />
        </div>

        {/* Store Name */}
        <p className="font-bold text-gray-800 text-lg">TCGMARKET</p>

        {/* Payment Buttons */}
        <div className="mt-5 flex flex-col gap-3">
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
            onClick={handlePaymentSuccess} // ✅ ล้างตะกร้า + ไปหน้าสำเร็จ
          >
            ยืนยันการชำระเงิน
          </button>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
            onClick={() => router.push("/payments")}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
