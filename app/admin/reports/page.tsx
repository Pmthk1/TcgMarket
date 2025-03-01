import SalesReport from "@/app/admin/components/SalesReport";
import AuctionReport from "@/app/admin/components/AuctionReport";
import UserReport from "@/app/admin/components/UserReport";



export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesReport />
        <AuctionReport />
        <UserReport />
      </div>
    </div>
  );
}
