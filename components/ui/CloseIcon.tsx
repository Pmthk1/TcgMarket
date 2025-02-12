'use client';
import { useRouter } from 'next/navigation';
import { CircleX } from 'lucide-react';

const CloseIcon = () => {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <button onClick={handleClose} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200">
      <CircleX className="w-6 h-6 text-gray-600" />
    </button>
  );
};

export default CloseIcon;