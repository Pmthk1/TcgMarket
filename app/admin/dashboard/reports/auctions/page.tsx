"use client";

import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

export default function SalesAndAuctionsReports() {
  const [salesData, setSalesData] = useState<{ date: string; total: number }[]>([]);
  const [auctionData, setAuctionData] = useState<{ cardName: string; count: number }[]>([]);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch("/api/reports/sales");
        const data = await response.json();
        setSalesData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setSalesData([]);
      }
    }

    async function fetchAuctionData() {
      try {
        const response = await fetch("/api/reports/auctions");
        const data = await response.json();
        setAuctionData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching auction data:", error);
        setAuctionData([]);
      }
    }

    fetchSalesData();
    fetchAuctionData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">รายงานยอดขาย</h2>
      {salesData.length > 0 ? (
        <>
          <Line
            data={{
              labels: salesData.map((data) => data.date),
              datasets: [
                {
                  label: "ยอดขายรวม",
                  data: salesData.map((data) => data.total),
                  borderColor: "#4CAF50",
                  backgroundColor: "rgba(76, 175, 80, 0.2)",
                  fill: true,
                },
              ],
            }}
          />
          <Bar
            data={{
              labels: salesData.map((data) => data.date),
              datasets: [
                {
                  label: "ยอดขาย",
                  data: salesData.map((data) => data.total),
                  backgroundColor: "#FF9800",
                },
              ],
            }}
          />
        </>
      ) : (
        <p>ไม่มีข้อมูลยอดขาย</p>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">การ์ดที่ถูกประมูลมากที่สุด</h2>
      {auctionData.length > 0 ? (
        <Bar
          data={{
            labels: auctionData.map((data) => data.cardName),
            datasets: [
              {
                label: "จำนวนการประมูล",
                data: auctionData.map((data) => data.count),
                backgroundColor: "#2196F3",
              },
            ],
          }}
        />
      ) : (
        <p>ไม่มีข้อมูลการประมูล</p>
      )}
    </div>
  );
}