import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="w-20 h-20 relative">
        <Image
          src="/images/TCGLogo1.png"
          alt="Logo"
          width={80}
          height={80}
          quality={100}
          className="rounded-full object-cover"
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default Logo;