'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react"; 
import { useCart } from '@/components/context/CartContext';

const Card10 = () => {
  const router = useRouter(); 
  const { addToCart } = useCart();

  const product = {
    id: 'shower-ex',
    name: 'ชาวเวอร์ส EX',
    price: 420,
    image: '/images/shower-ex.png',
    quantity: 1,
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl border border-gray-50">
        
        {/* ✅ ปุ่ม Close ที่ทำงานได้จริง */}
        <button 
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
          onClick={() => router.push('/products')}
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="flex items-center space-x-4">
          {/* ✅ รูปภาพสินค้า */}
          <Image 
            src="/images/shower-ex.png" 
            alt="ชาวเวอร์ส EX" 
            width={280} 
            height={420} 
            className="rounded-xl shadow-lg" 
          />
          <div className="text-left">
            <p className="text-lg font-semibold">
              ชื่อสินค้า: <span className="font-normal">ชาวเวอร์ส EX</span>
            </p>

            {/* ✅ เปลี่ยนสี "รายละเอียดสินค้า" เป็นสีเขียว */}
            <p className="text-lg font-semibold mt-2 text-green-600">รายละเอียดสินค้า:</p>
            <p className="mt-1">
              เผยโฉม <strong>ชาวเวอร์ส EX</strong> ที่จะทำแดมเมจกับโปเกมอน EX ของฝ่ายตรงข้ามทุกตัว ตัวละ <strong>60</strong>! <br />
              ท่าต่อสู้ <strong>[โซฟีสคอลอล]</strong> สามารถทำแดมเมจกับโปเกมอน EX ของฝ่ายตรงข้ามทุกตัวได้ตัวละ <strong>60</strong>!<br />
              ท่าต่อสู้ <strong>[อะความาริน]</strong> สามารถปล่อยแดมเมจได้ถึง <strong>280</strong> เชียวล่ะ นับ 2 ที่นับแบบใช้กันให้ลูกทีมหวาดผวากันเลย!
            </p>

            {/* ✅ ราคาสินค้า */}
            <p className="text-lg font-bold mt-4 text-red-500">
              ราคา: ฿420
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
    </div>
  );
};

export default Card10;
