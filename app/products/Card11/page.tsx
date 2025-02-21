'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react'; // ใช้ X แทน CloseIcon
import { useCart } from '@/components/context/CartContext';

const Card11 = () => {
  const router = useRouter(); // ✅ ใช้ useRouter() สำหรับเปลี่ยนหน้า
  const { addToCart } = useCart();

  const product = {
    id: 'silvers-rayleigh',
    name: 'Silvers Rayleigh',
    price: 800,
    image: '/images/silvers-rayleigh.png',
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
          onClick={() => router.push('/products')} // ✅ กลับไปที่หน้า products
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="flex items-center space-x-4">
          <Image 
            src="/images/silvers-rayleigh.png" 
            alt="Silvers Rayleigh" 
            width={280} 
            height={420} 
            className="rounded-xl shadow-lg" 
          />
          <div className="text-left">
            <p className="text-lg font-semibold">ชื่อสินค้า: <span className="font-normal">Silvers Rayleigh</span></p>
            <p className="text-lg font-semibold mt-2 text-green-600">รายละเอียดสินค้า:</p>
            <p className="mt-1">
              ความสามารถอันทรงพลังของ <strong>Silvers Rayleigh</strong> <br />
              ทำให้สามารถลดพาวเวอร์ของการ์ดคาแรคเตอร์คู่แข่งได้ จากนั้นจะ <strong>KO</strong> คาแรคเตอร์ไม่เกิน 1 ใบ
              ที่มีพาวเวอร์ <strong>3000</strong> หรือต่ำกว่าได้ด้วย!
            </p>
            <p className="text-lg font-bold mt-4 text-red-500">
              ราคา: ฿800
            </p>

            {/* ปุ่มเพิ่มใส่ตะกร้า */}
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

export default Card11;
