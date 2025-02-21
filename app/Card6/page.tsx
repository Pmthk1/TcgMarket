'use client';
import Image from 'next/image';
import CloseIcon from '@/components/ui/CloseIcon';
import { useCart } from '@/components/context/CartContext';

const Card6 = () => {
  const { addToCart } = useCart();

  const product = {
    id: 'juniper-ex',
    name: 'จูไนเปอร์ ex',
    price: 290,
    image: '/images/juniper-ex.png',
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
          <Image src="/images/juniper-ex.png" alt="จูไนเปอร์ ex" width={280} height={420} className="rounded-xl shadow-lg" />
          <div className="text-left">
            <p className="text-lg font-semibold">ชื่อสินค้า: <span className="font-normal">จูไนเปอร์ ex</span></p>
            <p className="text-lg font-semibold mt-2">รายละเอียดสินค้า:</p>
            <p className="mt-1">
              ความสามารถ <strong>[ฮิรัสเรส]</strong> ช่วยให้การต่อสู้เป็นไปอย่างง่ายดายและทรงพลัง<br />
              ท่าต่อสู้ <strong>[สปีดเชอร์เรโร่]</strong> ทำให้สามารถโจมตีได้อย่างรวดเร็วและมีพลังทำลายสูง!
            </p>
            <p className="text-lg font-semibold mt-2">ราคา: <span className="font-normal">฿290</span></p>
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

export default Card6;