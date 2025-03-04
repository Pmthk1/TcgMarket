"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/context/CartContext";

const QRCodePageContent = () => {
  const searchParams = useSearchParams();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  // ✅ คำนวณราคารวม
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const method = searchParams.get("method") || "PromptPay";
  const fakeQRCodeUrl = "/images/fake_qr_code.png";

  // ✅ ฟังก์ชันยืนยันการชำระเงิน
  const handleConfirmPayment = () => {
    clearCart(); // ล้างตะกร้า
    setTimeout(() => {
      router.push("/payments/success"); // ไปยังหน้า PaymentSuccess หลังจากล้างตะกร้า
    }, 500); // หน่วงเวลาเล็กน้อยเพื่อให้ useCart อัปเดต
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-3">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center mt-2">
        <h1 className="text-2xl font-bold text-gray-800">ชำระเงินด้วย {method}</h1>
        <p className="text-lg text-gray-600 mt-3">
          ยอดชำระ <strong className="text-gray-900">฿{totalPrice}</strong>
        </p>

        <div className="flex flex-col items-center border border-gray-300 p-2 rounded-lg mt-3">
          <Image src="/images/thai_qr_payment.png" alt="Thai QR Payment" width={400} height={40} />
          <div className="flex justify-center p-2">
            <Image src={fakeQRCodeUrl} alt="Fake QR Code" width={250} height={220} className="rounded-lg object-contain" />
          </div>
          <p className="text-xl font-bold text-gray-900 py-2">TCGMARKET</p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleConfirmPayment}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            ยืนยันการชำระเงิน
          </button>
          <button
            onClick={() => router.replace("/cart")}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePageContent;
