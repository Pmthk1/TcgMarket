"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ReportsPage = () => {
  const [data, setData] = useState({
    totalAuctions: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await fetch("/api/reports");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 รายงานสรุป</h1>
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/dashboard/reports/auctions">
            <div className="p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition cursor-pointer">
              จำนวนการประมูล: {data.totalAuctions} รายการ
            </div>
          </Link>
          <Link href="/admin/dashboard/reports/users">
            <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition cursor-pointer">
              จำนวนผู้ใช้: {data.totalUsers} คน
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
