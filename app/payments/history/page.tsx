"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface PaymentItem {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  items: { id: string; name: string; imageUrl: string; quantity: number }[];
}

const PaymentHistory = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const [history, setHistory] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/payments/history?userId=${userId}`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
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
        <div className="space-y-6">
          {history.map((payment) => (
            <div key={payment.id} className="bg-white p-5 shadow-md rounded-lg">
              <div className="space-y-3">
                {payment.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md" />
                    <div>
                      <p className="text-gray-900 font-medium">📌 ชื่อ: {item.name}</p>
                      <p className="text-gray-600">📌 จำนวน: {item.quantity} ชิ้น</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-3">
                <p className="text-lg font-semibold text-gray-900">💰 ฿{payment.amount}</p>
                <p className="text-gray-700">📌 ช่องทาง: {payment.paymentMethod}</p>
                <p className={`font-semibold ${payment.paymentStatus === "COMPLETED" ? "text-green-600" : "text-red-600"}`}>
                  ⚡ สถานะ: {payment.paymentStatus === "COMPLETED" ? "✅ COMPLETED" : "❌ FAILED"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
