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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch("/api/reports/sales");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: SalesData[] = await response.json();
        if (Array.isArray(data)) {
          setSalesData(data);
        } else {
          throw new Error("Received data is not an array");
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSalesData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
