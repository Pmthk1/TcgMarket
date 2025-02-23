"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Products", path: "/admin/products" },
  { name: "Auctions", path: "/admin/auctions" },
  { name: "Reports", path: "/admin/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-5">
      <h2 className="text-lg font-bold mb-5">Admin Panel</h2>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block py-2 px-4 rounded-md ${
              pathname === item.path ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
