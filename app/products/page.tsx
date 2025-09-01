"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  type: "pokemon" | "one piece";
};

const products: Product[] = [
  { id: 7, name: "อีวุย", image: "/images/eevee.png", price: 250, type: "pokemon" },
  { id: 8, name: "บูสเตอร์ EX", image: "/images/booster-ex.png", price: 400, type: "pokemon" },
  { id: 9, name: "อีวุย EX", image: "/images/eevee-ex.png", price: 350, type: "pokemon" },
  { id: 10, name: "ชาวเวอร์ส EX", image: "/images/shower-ex.png", price: 420, type: "pokemon" },
  { id: 11, name: "Silvers Rayleigh", image: "/images/silvers-rayleigh.png", price: 800, type: "one piece" },
  { id: 12, name: "GOD Ene", image: "/images/god-ene.png", price: 850, type: "one piece" },
  { id: 13, name: "Sabo", image: "/images/sabo.png", price: 900, type: "one piece" },
  { id: 14, name: "Luffy เกียร์ 5", image: "/images/luffy-5.png", price: 1000, type: "one piece" },
  { id: 15, name: "Kaido", image: "/images/kaido.png", price: 1100, type: "one piece" },
  { id: 16, name: "BOOSTER PACK-Paramount War", image: "/images/booster-pack-paramount-war.png", price: 3200, type: "one piece" },
];

const formatTHB = (n: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);

export default function ProductsPage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<"all" | Product["type"]>("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return [...products]
      .filter((p) => (filterType === "all" ? true : p.type === filterType))
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase().trim()))
      .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));
  }, [sortOrder, filterType, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Top bar */}
      <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-slate-800">รายการสินค้า</h1>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาชื่อการ์ด…"
                spellCheck={false}
                className="w-72 rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                value={sortOrder}
              >
                <option value="asc">ราคาต่ำ → สูง</option>
                <option value="desc">ราคาสูง → ต่ำ</option>
              </select>

              <select
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "all" || v === "pokemon" || v === "one piece") {
                    setFilterType(v);
                  }
                }}
              >
                <option value="all">ทุกประเภท</option>
                <option value="pokemon">Pokemon</option>
                <option value="one piece">One Piece</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="mb-4 text-sm text-slate-600">
          พบสินค้า <span className="font-semibold text-slate-800">{results.length}</span> รายการ
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-slate-500">
            ไม่มีสินค้าที่ตรงกับตัวกรอง/คำค้นหา
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((p) => (
              <Link key={p.id} href={`/products/Card${p.id}`} className="group">
                <article
                  className="
                    relative overflow-hidden rounded-2xl
                    bg-white shadow-sm ring-1 ring-slate-100
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl hover:ring-blue-200
                  "
                >
                  {/* Gradient ring */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(59,130,246,.15), transparent 40%)",
                    }}
                  />

                  {/* Badge */}
                  <span className="absolute left-2 top-2 z-10 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur">
                    {p.type}
                  </span>

                  {/* Image */}
                  <div className="relative aspect-[5/7] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1280px) 240px, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={p.id <= 10}
                    />
                    <div
                      className="
                        pointer-events-none absolute inset-x-3 bottom-3
                        translate-y-3 opacity-0
                        rounded-xl bg-white/90 px-3 py-2 text-center text-sm font-medium text-slate-800 shadow
                        backdrop-blur transition-all duration-300
                        group-hover:translate-y-0 group-hover:opacity-100
                      "
                    >
                      ดูรายละเอียด
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1 px-3 py-3">
                    <h3 className="line-clamp-1 font-semibold text-slate-900">{p.name}</h3>
                    <p className="text-sm text-blue-700">{formatTHB(p.price)}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
