"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface LoginData {
  date: string;
}

interface ChartData {
  date: string;
  count: number;
}

export default function UserReportPage() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchLoginData() {
      const response = await fetch("/api/clerk/logins");
      const data: LoginData[] = await response.json();

      const loginCounts = data.reduce<Record<string, number>>((acc, log) => {
        const date = log.date.split("T")[0]; // ดึงเฉพาะวันที่
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const formattedData: ChartData[] = Object.keys(loginCounts).map((date) => ({
        date,
        count: loginCounts[date],
      }));

      setChartData(formattedData);
    }

    fetchLoginData();
  }, []);

  return (
    <div>
      <h2>รายงานการเข้าสู่ระบบของผู้ใช้</h2>
      <Bar
        data={{
          labels: chartData.map((data) => data.date),
          datasets: [
            {
              label: "จำนวนการเข้าสู่ระบบ",
              data: chartData.map((data) => data.count),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        }}
        options={{
          scales: {
            y: {
              ticks: {
                stepSize: 1, // บังคับให้แกน Y เพิ่มขึ้นทีละ 1
                callback: (value) => Number(value).toFixed(0), // ตัดทศนิยมออก
              },
            },
          },
        }}
      />
    </div>
  );
}
