"use client";

import { ShoppingCart } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/context/CartContext"; // ✅ Import useCart

const Cart = () => {
  const { cart } = useCart(); // ✅ ใช้ useCart() เพื่อดึงตะกร้าสินค้า
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  // ✅ คำนวณจำนวนสินค้าทั้งหมดในตะกร้า
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCartClick = () => {
    if (!isSignedIn) {
      openSignIn();
    } else {
      router.push("/cart");
    }
  };

  return (
    <div className="relative cursor-pointer" onClick={handleCartClick}>
      <ShoppingCart size={30} className="text-black" />
      {totalCartItems > 0 && ( // ✅ แสดงตัวเลขถ้ามีสินค้าตั้งแต่ 1 ชิ้นขึ้นไป
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {totalCartItems}
        </span>
      )}
    </div>
  );
};

export default Cart;
