"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminCard from "@/app/admin/components/AdminCard";
import ReportChart from "@/app/admin/components/ReportChart";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalAuctions: 0,
    totalBids: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch summary data
        const summaryRes = await fetch("/api/reports/summary");
        if (!summaryRes.ok) throw new Error(`Failed to fetch summary data: ${summaryRes.statusText}`);
        const summaryData = await summaryRes.json();

        // Fetch chart data
        const trendsRes = await fetch("/api/reports/trends");
        if (!trendsRes.ok) throw new Error(`Failed to fetch trends data: ${trendsRes.statusText}`);
        const trendsData = await trendsRes.json();

        setSummary({
          totalUsers: summaryData.totalUsers || 0,
          totalAuctions: summaryData.totalAuctions || 0,
          totalBids: summaryData.totalBids || 0,
        });

        setChartData({
          labels: Array.isArray(trendsData.labels) ? trendsData.labels : [],
          datasets: Array.isArray(trendsData.datasets) ? trendsData.datasets : [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <AdminHeader title="Admin Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <AdminCard title="Total Users" value={loading ? "Loading..." : summary.totalUsers.toString()} />
        <AdminCard title="Total Auctions" value={loading ? "Loading..." : summary.totalAuctions.toString()} />
        <AdminCard title="Total Bids" value={loading ? "Loading..." : summary.totalBids.toString()} />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Sales & Auctions Trends</h2>
        {loading ? <p>Loading chart...</p> : <ReportChart data={chartData} />}
      </div>
    </div>
  );
}