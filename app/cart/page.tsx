"use client";

import { useCart } from "@/components/context/CartContext";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { CartItem } from "@/components/context/CartContext";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cart, clearCart, updateQuantity } = useCart();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter(); // ✅ ใช้ router เพื่อไปหน้าชำระเงิน

  if (!isSignedIn) {
    openSignIn();
    return null;
  }

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleIncreaseQuantity = (item: CartItem) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return; // ถ้าไม่มีสินค้า ไม่ให้กดไปชำระเงิน
    router.push("/payments");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ตะกร้าสินค้า</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">ยังไม่มีสินค้าในตะกร้า</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b py-3">
              <Image
                src={item.image}
                alt={item.name}
                width={70}
                height={70}
                className="rounded-lg shadow-md"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-gray-600 text-sm">฿{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleDecreaseQuantity(item)}
                    className="px-2 py-1 rounded-lg"
                  >
                    -
                  </button>
                  <span className="text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item)}
                    className="px-2 py-1 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="font-semibold text-gray-800">฿{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex justify-between items-center font-semibold text-lg">
              <p>รวมทั้งหมด:</p>
              <p>฿{totalPrice}</p>
            </div>
            <button
              onClick={handleCheckout} // ✅ กดแล้วไปหน้าชำระเงิน
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-md"
            >
              สั่งซื้อสินค้า
            </button>
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-md"
            >
              ลบสินค้าทั้งหมด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
