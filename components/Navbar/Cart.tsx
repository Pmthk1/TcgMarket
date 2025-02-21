"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Cart = () => {
  const [cartItems] = useState(0);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk(); // ใช้ useClerk() เพื่อเรียก openSignIn
  const router = useRouter();

  const handleCartClick = () => {
    if (!isSignedIn) {
      openSignIn(); // แก้ไขให้เรียก openSignIn() แทน Clerk.openSignIn()
    } else {
      router.push("/cart");
    }
  };

  return (
    <div className="relative cursor-pointer" onClick={handleCartClick}>
      <ShoppingCart size={30} className="text-black" />
      {cartItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {cartItems}
        </span>
      )}
    </div>
  );
};

export default Cart;
