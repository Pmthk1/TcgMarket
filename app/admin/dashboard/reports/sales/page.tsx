"use client";

import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

interface SalesData {
  date: string;
  total: number;
}

export default function SalesReportPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    async function fetchSalesData() {
      const response = await fetch("/api/reports/sales");
      const data: SalesData[] = await response.json();
      setSalesData(data);
    }

    fetchSalesData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 รายงานยอดขาย</h2>

      <div className="mb-6">
        <Line
          data={{
            labels: salesData.map((data) => data.date),
            datasets: [
              {
                label: "ยอดขายรวม (บาท)",
                data: salesData.map((data) => data.total),
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                fill: true,
              },
            ],
          }}
        />
      </div>

      <div>
        <Bar
          data={{
            labels: salesData.map((data) => data.date),
            datasets: [
              {
                label: "ยอดขายรายวัน (บาท)",
                data: salesData.map((data) => data.total),
                backgroundColor: "#FF9800",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
