"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

const promotions = [
  '/images/bgpromo1.png',
  '/images/bgpromo2.png',
  '/images/bgpromo3.png',
  '/images/bgpromo4.png'
];

const SlidePromotion: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-4">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        className="rounded-xl shadow-lg"
      >
        {promotions.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={`Promotion ${index + 1}`}
              width={1200}
              height={500}
              className="w-full h-[400px] object-contain rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlidePromotion;
