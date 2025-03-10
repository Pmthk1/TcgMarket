"use client"; // ทำให้ไฟล์นี้เป็น Client Component

import { Suspense } from "react";
import dynamic from "next/dynamic";

const PaymentHistoryContent = dynamic(() => import("@/components/ui/PaymentHistoryContent"));

const PaymentHistoryPage = () => {
  return (
    <Suspense fallback={<p className="text-gray-500">กำลังโหลด...</p>}>
      <PaymentHistoryContent />
    </Suspense>
  );
};

export default PaymentHistoryPage;
