"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const products = [
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

const Products = () => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("all");

  const sortedProducts = [...products]
    .filter((product) => filterType === "all" || product.type === filterType)
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">รายการสินค้า</h1>
      <div className="mb-4 flex space-x-4">
        <select className="p-2 border rounded" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">ราคาต่ำไปสูง</option>
          <option value="desc">ราคาสูงไปต่ำ</option>
        </select>
        <select className="p-2 border rounded" onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="all">ทุกประเภท</option>
          <option value="pokemon">Pokemon</option>
          <option value="one piece">One Piece</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">ไม่มีสินค้าที่ตรงกับตัวกรอง</p>
        ) : (
          sortedProducts.map((product) => (
            <Link key={product.id} href={`/products/Card${product.id}`}>
              <div className="cursor-pointer text-center transition-transform transform hover:scale-105 hover:shadow-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={280}
                  className="rounded-lg object-cover mx-auto"
                  onError={(e) => (e.currentTarget.src = "/images/placeholder.png")} // Fallback Image
                />
                <p className="text-lg font-semibold mt-2">{product.name}</p>
                <p className="text-sm text-gray-600">฿{product.price}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
