"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface PaymentItem {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  items: { name: string; imageUrl: string; quantity: number }[];
}

const PaymentHistory = ({ userId }: { userId: string }) => {
  const [history, setHistory] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/payments/history?userId=${userId}`);
  
        if (!res.ok) {
          // 🛑 ถ้า API ส่งสถานะ error ให้โยน error ออกไป
          throw new Error(`HTTP Error: ${res.status}`);
        }
  
        // ✅ ตรวจสอบว่า response เป็น JSON จริง ๆ
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("❌ Response is not JSON");
        }
  
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("❌ Error fetching payment history:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchHistory();
  }, [userId]);
  

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📜 ประวัติการชำระเงิน</h1>

      {isLoading ? (
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">ไม่มีประวัติการชำระเงิน</p>
      ) : (
        <div className="space-y-4">
          {history.map((payment) => (
            <div key={payment.id} className="bg-white p-4 shadow-md rounded-lg">
              <p className="text-lg font-semibold text-gray-900">
                💰 จำนวนเงิน: ฿{payment.amount}
              </p>
              <p className="text-gray-700">📌 ช่องทาง: {payment.paymentMethod}</p>
              <p
                className={`font-semibold ${
                  payment.paymentStatus === "SUCCESS" ? "text-green-600" : "text-red-600"
                }`}
              >
                ⚡ สถานะ: {payment.paymentStatus}
              </p>

              {/* แสดงสินค้าในคำสั่งซื้อ */}
              <div className="mt-3 space-y-2">
                {payment.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 border p-2 rounded-lg">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">จำนวน: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
