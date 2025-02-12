'use client';
import Image from 'next/image';
import CloseIcon from '@/components/ui/CloseIcon';

const Card1 = () => {
  return (
    <div className="p-12 bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl border border-gray-50">
        <CloseIcon />
        <div className="flex items-center space-x-12">
          <Image src="/images/buggy.png" alt="buggy" width={280} height={420} className="rounded-xl shadow-lg" />
          <div className="text-left">
            <p className="text-lg font-semibold">ชื่อสินค้า: <span className="font-normal">buggy</span></p>
            <p className="text-lg font-semibold mt-2">รายละเอียดสินค้า:</p>
            <p className="mt-1">มาจากแพคการ์ด <strong>one piece op 010</strong><br />เป็นตัวละครลูกเรือคนเขียน</p>
            <div className="flex items-center mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow">เพิ่มใส่ตะกร้า</button>
              <Image src="/images/anime1.png" alt="anime icon" width={50} height={50} className="ml-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card1;
