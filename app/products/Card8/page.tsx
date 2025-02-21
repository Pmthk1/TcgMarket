'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react"; 
import { useCart } from '@/components/context/CartContext';

const Card8 = () => {
  const router = useRouter();
  const { addToCart } = useCart();

  const product = {
    id: 'booster-ex',
    name: 'บูสเตอร์ EX',
    price: 400,
    image: '/images/booster-ex.png',
    quantity: 1,
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl border border-gray-300 flex">

        {/* ✅ ปุ่ม Close ที่ทำงานได้จริง */}
        <button 
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
          onClick={() => router.push('/products')}
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* ✅ รูปภาพสินค้า */}
        <div className="flex-shrink-0">
          <Image 
            src="/images/booster-ex.png" 
            alt="บูสเตอร์ EX" 
            width={280} 
            height={420} 
            className="rounded-xl shadow-lg" 
          />
        </div>

        {/* ✅ รายละเอียดสินค้า */}
        <div className="ml-6 text-left flex-1">
          <p className="text-lg font-semibold">
            ชื่อสินค้า: <span className="font-normal">บูสเตอร์ EX</span>
          </p>

          {/* ✅ เปลี่ยนสี "รายละเอียดสินค้า" เป็นสีเขียว */}
          <p className="text-lg font-semibold mt-2 text-green-600">รายละเอียดสินค้า:</p>
          <p className="mt-1">
            <strong>บูสเตอร์ EX</strong> ที่มีบทบาทได้ตั้งแต่ต้นจนจบเกม! <br />
            ท่าต่อสู้ <strong>[โบลท์บิงชาร์จ]</strong> ทำแดเมจได้ <strong>130</strong> และช่วยให้เลือกการ์ดพลังงานพื้นฐาน 2 ใบจากสำรับการ์ดมาติดที่โปเกมอนของตัวเอง 1 ตัวได้ทันที!
          </p>
          <p className="mt-2">
            ส่วนท่าต่อสู้ <strong>[การเปลี่ยน]</strong> นั้นสามารถทำแดเมจได้ถึง <strong>280</strong> ซึ่งเป็นบทบาทสำคัญในเกมจนถึงท้ายเกมเลย!
          </p>

          {/* ✅ ราคาสินค้า */}
          <p className="text-lg font-bold mt-4 text-red-500">
            ราคา: ฿400
          </p>

          {/* ✅ ปุ่มเพิ่มสินค้า + ไอคอน */}
          <div className="flex items-center mt-4">
            <button 
              onClick={handleAddToCart} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
            >
              เพิ่มใส่ตะกร้า
            </button>
            <Image 
              src="/images/anime1.png" 
              alt="anime icon" 
              width={50} 
              height={50} 
              className="ml-4" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card8;
