import Image from "next/image";
import Footer from "../components/ui/Footer";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="p-12 grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow justify-center">
        <div className="text-center flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/buggy.png"
            alt="buggy"
            width={280}
            height={420}
            className="rounded-xl shadow-lg mx-auto object-cover aspect-[2/3]"
          />
          <p className="mt-4 text-lg font-medium">buggy</p>
        </div>

        <div className="text-center flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/pikachu-ex.png"
            alt="พิคาชู ex"
            width={280}
            height={420}
            className="rounded-xl shadow-lg object-cover aspect-[2/3]"
          />
          <p className="mt-4 text-lg font-medium">พิคาชู ex</p>
        </div>

        <div className="text-center flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/milocalos-ex.png"
            alt="มิโลคาลอส ex"
            width={280}
            height={420}
            className="rounded-xl shadow-lg object-cover aspect-[2/3]"
          />
          <p className="mt-4 text-lg font-medium">มิโลคาลอส ex</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
