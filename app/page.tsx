"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "../components/ui/Footer";
import { Search } from "lucide-react";
import SlidePromotion from "../components/ui/SlidePromotion";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const cardData = [
  { id: 1, name: "buggy", image: "/images/buggy.png", link: "/Card1" },
  { id: 2, name: "พิคาชู ex", image: "/images/pikachu-ex.png", link: "/Card2" },
  { id: 3, name: "มิโลคาลอส ex", image: "/images/milocalos-ex.png", link: "/Card3" },
  { id: 4, name: "ปิคซี ex", image: "/images/pixie-ex.png", link: "/Card4" },
  { id: 5, name: "วินดี ex", image: "/images/windy-ex.png", link: "/Card5" },
  { id: 6, name: "จูไนเปอร์ ex", image: "/images/juniper-ex.png", link: "/Card6" }
];

const HomePage: React.FC = () => {
  const [filteredCards, setFilteredCards] = useState(cardData);
  const [query, setQuery] = useState('');

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredCards(cardData);
    } else {
      const filtered = cardData.filter(card =>
        card.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCards(filtered);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="p-14 flex justify-start">
        <div className="flex items-center border border-gray-500 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-400 w-64">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="ค้นหาการ์ด..."
            value={query}
            spellCheck={false}
            onChange={(e) => {
              setQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Slide Promotion */}
      <SlidePromotion />

      {/* แสดงการ์ด */}
      <main className={`flex-grow ${filteredCards.length === 0 ? 'flex items-center justify-center' : 'p-14 flex flex-wrap justify-center gap-8'}`}>
        {filteredCards.length > 0 ? (
          filteredCards.map(card => (
            <div key={card.id} className="text-center flex flex-col items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer mt-10">
              
              {/* ถ้าล็อกอินแล้วให้กดที่รูปเข้าไปดูได้เลย */}
              <SignedIn>
                <Link href={card.link} passHref>
                  <Image
                    src={card.image}
                    alt={card.name}
                    width={200}
                    height={420}
                    className="rounded-xl shadow-lg mx-auto object-cover aspect-[2/3]"
                  />
                </Link>
              </SignedIn>

              {/* ถ้ายังไม่ล็อกอิน กดที่รูปแล้วเปิด Sign In Modal */}
              <SignedOut>
                <SignInButton mode="modal">
                  <Image
                    src={card.image}
                    alt={card.name}
                    width={200}
                    height={420}
                    className="rounded-xl shadow-lg mx-auto object-cover aspect-[2/3]"
                  />
                </SignInButton>
              </SignedOut>

              <p className="mt-4 text-lg font-medium">{card.name}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-2xl font-semibold text-gray-700">ไม่พบการ์ดที่ค้นหา</p>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
