'use client';
import Image from 'next/image';
import CloseIcon from '@/components/ui/CloseIcon';
import { useCart } from '@/components/context/CartContext';

const Card2 = () => {
  const { addToCart } = useCart();

  const product = {
    id: 'pikachu-ex',
    name: 'พิคาชู ex',
    price: 350,
    image: '/images/pikachu-ex.png',
    quantity: 1,
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl border border-gray-50">
        <CloseIcon />
        <div className="flex items-center space-x-4">
          <Image src="/images/pikachu-ex.png" alt="พิคาชู ex" width={280} height={420} className="rounded-xl shadow-lg" />
          <div className="text-left">
            <p className="text-lg font-semibold">ชื่อสินค้า: <span className="font-normal">พิคาชู ex</span></p>
            <p className="text-lg font-semibold mt-2">รายละเอียดสินค้า:</p>
            <p className="mt-1">
              ถ้ามี HP เต็มล่ะก็จะไม่หมดสภาพ!? มีท่าต่อสู้สุดอลังการ <strong>โทแพซโฮลด์</strong> ที่ทำ
              ให้เกมบอบบนตำแหน่งหน่วยต่อสู้สูงสุดของฝ่ายตรงข้ามได้สูงถึง 300<br />
              และสามารถยืนหยัดต่อในเทิร์นถัดไปของฝ่ายตัวเองได้ด้วย HP ที่คงเหลืออยู่ [10]<br />
              เป็นพลังจู่โจมที่พึ่งพาได้ดีเลย!
            </p>
            <p className="text-lg font-semibold mt-2">ราคา: <span className="font-normal">฿350</span></p>
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

export default Card2;
