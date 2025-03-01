"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminHeader from "@/app/admin/components/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface Auction {
  id: string;
  status: string;
}

export default function AdminAuctions() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const res = await fetch("/api/auctions");
        if (!res.ok) throw new Error("Failed to fetch auctions");
        const data: Auction[] = await res.json();
        setAuctions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuctions();
  }, []);

  const filteredAuctions = auctions.filter(
    (auction) => statusFilter === "ALL" || auction.status === statusFilter
  );

  if (!isClient) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <AdminHeader title="Manage Auctions" />
      <Card className="p-4 shadow-md">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white shadow-sm"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>

            <Button
              onClick={() => router.push("/admin/auctions/create")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Create Auction
            </Button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading auctions...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell>{auction.id}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-lg text-white font-semibold ${
                          auction.status === "CLOSED"
                            ? "bg-red-500"
                            : auction.status === "ACTIVE"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {auction.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          router.push(`/admin/auctions/manage?id=${auction.id}`)
                        }
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
