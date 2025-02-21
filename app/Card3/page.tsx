'use client';
import Image from 'next/image';
import CloseIcon from '@/components/ui/CloseIcon';
import { useCart } from '@/components/context/CartContext';

const Card3 = () => {
  const { addToCart } = useCart();

  const product = {
    id: 'milocalos-ex',
    name: 'มิโลคาลอส ex',
    price: 280,
    image: '/images/milocalos-ex.png',
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
          <Image src="/images/milocalos-ex.png" alt="มิโลคาลอส ex" width={280} height={420} className="rounded-xl shadow-lg" />
          <div className="text-left">
            <p className="text-lg font-semibold">ชื่อสินค้า: <span className="font-normal">มิโลคาลอส ex</span></p>
            <p className="text-lg font-semibold mt-2">รายละเอียดสินค้า:</p>
            <p className="mt-1">
              ท่าต่อสู้ <strong>เกล็ดส่องประกาย</strong> ไม่ได้รับแดเมจและเอฟเฟกต์ของท่าต่อสู้จากโปเกมอนฝ่ายตรงข้าม<br />
              <strong>ฮิปโนสเปลซ</strong> 160 ทำให้โปเกมอนบนตำแหน่งต่อสู้ฝ่ายตรงข้ามเป็นสภาวะหลับ
            </p>
            <p className="text-lg font-semibold mt-2">ราคา: <span className="font-normal">฿280</span></p>
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

export default Card3;
