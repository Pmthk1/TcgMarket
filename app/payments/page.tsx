"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/context/CartContext";
import { useRouter } from "next/navigation";

const PaymentPage = () => {
  const { cart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const router = useRouter();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePayment = () => {
    if (!selectedMethod) return;
    router.push("/payments/qrcode");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">เลือกช่องทางการชำระเงิน</h1>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setSelectedMethod("promptpay")}
            className={`p-3 border rounded-lg flex items-center gap-3 ${
              selectedMethod === "promptpay" ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
          >
            <Image src="/images/prompt-pay.png" alt="PromptPay" width={40} height={40} />
            <span>PromptPay</span>
          </button>
        </div>
        <div className="mt-6 text-lg font-semibold text-right">รวม: ฿{totalPrice}</div>
        <button
          onClick={handlePayment}
          className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg font-bold"
        >
          ดำเนินการชำระเงิน
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
