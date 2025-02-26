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

interface Auction {
  id: string;
  title: string;
  status: string;
}

export default function AdminAuctions() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const res = await fetch("/api/auctions");
        if (!res.ok) throw new Error("Failed to fetch auctions");
        const data: Auction[] = await res.json();
        setAuctions(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAuctions();
  }, []);

  return (
    <div>
      <AdminHeader title="Manage Auctions" />
      <div className="flex justify-end mb-4">
        <Button onClick={() => router.push("/admin/auctions/create")}>
          Create Auction
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell>{auction.id}</TableCell>
              <TableCell>{auction.title}</TableCell>
              <TableCell>{auction.status}</TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    router.push(`/admin/auctions/manage?id=${auction.id}`)
                  }
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
