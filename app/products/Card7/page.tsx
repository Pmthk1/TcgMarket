'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useCart } from '@/components/context/CartContext';

const Card7 = () => {
  const router = useRouter();
  const { addToCart } = useCart();

  const product = {
    id: 'eevee',
    name: 'อีวุย',
    price: 250,
    image: '/images/eevee.png',
    quantity: 1,
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl border border-gray-50">
        
        {/* ปุ่ม Close ที่จะกลับไปหน้าหลัก */}
        <button 
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
          onClick={() => router.push('/products')}
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="flex items-center space-x-4">
          {/* ✅ รูปภาพสินค้า อีวุย */}
          <Image 
            src="/images/eevee.png" 
            alt="อีวุย" 
            width={280} 
            height={420} 
            className="rounded-xl shadow-lg" 
          />
          <div className="text-left">
            <p className="text-lg font-semibold">
              ชื่อสินค้า: <span className="font-normal">อีวุย</span>
            </p>
            {/* ✅ เปลี่ยนสีข้อความ "รายละเอียดสินค้า" เป็นสีเขียว */}
            <p className="text-lg font-semibold mt-2 text-green-600">รายละเอียดสินค้า:</p>
            <p className="mt-1">
              แจกการ์ดโปรโมอีวุยฟรี 1 <br />
              ในเมื่อซื้อไปเกมอนเทรดดิ้งการ์ดเกม สการ์เล็ต & ไวโอเล็ต การ์ดชุดเสริมโซโลสาล <br />
              เทศกาลเทรดดิ้งคีลอส ex ที่จะวางจำหน่ายตั้งแต่วันที่ <strong>7 กุมภาพันธ์ 2025</strong> ยกกล่อง
            </p>

            {/* ✅ ราคาสินค้า */}
            <p className="text-lg font-bold mt-4 text-red-500">
              ราคา: ฿250
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

export default Card7;
