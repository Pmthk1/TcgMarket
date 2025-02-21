"use client";
import AdminHeader from "@/app/admin/dashboard/components/AdminHeader"; 
import AdminCard from "@/app/admin/dashboard/components/AdminCard"; // ✅ ต้องมี export default ในไฟล์นี้
import ReportChart from "@/app/admin/dashboard/components/ReportChart";

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader title="Admin Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <AdminCard title="Total Orders" value="1,234" />
        <AdminCard title="Total Revenue" value="$45,678" />
        <AdminCard title="Active Auctions" value="56" />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Sales & Auctions Trends</h2>
        <ReportChart />
      </div>
    </div>
  );
}
