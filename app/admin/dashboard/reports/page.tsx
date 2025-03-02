import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/dashboard/reports/sales" className="p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600">
          รายงานยอดขาย
        </Link>
        <Link href="/admin/dashboard/reports/auctions" className="p-4 bg-green-500 text-white rounded-lg text-center hover:bg-green-600">
          รายงานการประมูล
        </Link>
        <Link href="/admin/dashboard/reports/users" className="p-4 bg-purple-500 text-white rounded-lg text-center hover:bg-purple-600">
          รายงานผู้ใช้
        </Link>
      </div>
    </div>
  );
}
