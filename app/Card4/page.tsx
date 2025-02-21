'use client';
import Image from 'next/image';
import CloseIcon from '@/components/ui/CloseIcon';
import { useCart } from '@/components/context/CartContext';

const Card4 = () => {
  const { addToCart } = useCart();

  const product = {
    id: 'pixie-ex',
    name: 'ปิคซี ex',
    price: 300,
    image: '/images/pixie-ex.png',
    quantity: 1,
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl border border-gray-50">
        <CloseIcon />
        <div className="flex items-center space-x-4">
          <Image src="/images/pixie-ex.png" alt="ปิคซี ex" width={280} height={420} className="rounded-xl shadow-lg" />
          <div className="text-left">
            <p className="text-lg font-semibold">ชื่อสินค้า: <span className="font-normal">ปิคซี ex</span></p>
            <p className="text-lg font-semibold mt-2">รายละเอียดสินค้า:</p>
            <p className="mt-1">
              ความสามารถ <strong>[โซนฟื้นผิวดวงจันทร์]</strong> จะช่วยให้พลังงานสำหรับหนึ่งของโปเกมอนฝ่ายตัวเองหายไป<br />
              ส่วนท่าต่อสู้ <strong>[มูนวินเดอร์]</strong> สามารถโยกย้ายพลังงานบนกระดานของฝ่ายตัวเองได้ตามใจชอบ ลำไส้ปิคซีex ใกล้จะถูกล้ม ก็ย้ายพลังงานไปฝากฝังไว้กับโปเกมอนตัวถัดไปกันเถอะ!
            </p>
            <p className="text-lg font-semibold mt-2">ราคา: <span className="font-normal">฿300</span></p>
            <div className="flex items-center mt-4">
              <button 
                onClick={handleAddToCart} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
              >
                เพิ่มใส่ตะกร้า
              </button>
              <Image src="/images/anime1.png" alt="anime icon" width={50} height={50} className="ml-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card4;