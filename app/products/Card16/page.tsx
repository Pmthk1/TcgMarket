'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react'; 
import { useCart } from '@/components/context/CartContext';

const Card16 = () => {
  const router = useRouter();
  const { addToCart } = useCart();

  const product = {
    id: 'booster-pack-paramount-war',
    name: 'Booster Pack - Paramount War',
    price: 3200,
    image: '/images/booster-pack-paramount-war.png',
    quantity: 1,
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl border border-gray-50">
        
        <button 
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
          onClick={() => router.push('/products')}
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="flex items-center space-x-4">
          <Image 
            src="/images/booster-pack-paramount-war.png" 
            alt="Booster Pack - Paramount War" 
            width={280} 
            height={420} 
            className="rounded-xl shadow-lg" 
          />
          <div className="text-left">
            <p className="text-lg font-semibold">ชื่อสินค้า: <span className="font-normal">Booster Pack - Paramount War</span></p>
            <p className="text-lg font-semibold mt-2 text-green-600">รายละเอียดสินค้า:</p>
            <p className="mt-1">Booster Pack Vol.2 เปิดจำหน่ายแล้ว! สัมผัสการต่อสู้สุดมันส์ใน <strong>ONE PIECE CARD GAME</strong></p>
            <p className="text-lg font-bold mt-4 text-red-500">
              ราคา: ฿3200
            </p>

            <div className="flex items-center space-x-4 mt-4">
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
                className="ml-2" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card16;