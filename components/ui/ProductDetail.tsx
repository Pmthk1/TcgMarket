"use client";

import { useCart } from "@/components/context/CartContext";
import Image from "next/image";
import { useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetail = ({ product }: { product: Product }) => {
  const { addToCart, cart } = useCart();

  const handleAddToCart = () => {
    if (!product || !product.id) {
      console.error(" Error: Product ID is missing", product);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  useEffect(() => {
    console.log(" Updated Cart:", cart);
  }, [cart]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <Image src={product.image} alt={product.name} width={300} height={400} className="rounded" />
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-bold text-blue-600">ราคา: ฿{product.price}</p>
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-all"
      >
        เพิ่มใส่ตะกร้า
      </button>
    </div>
  );
};

export default ProductDetail;
