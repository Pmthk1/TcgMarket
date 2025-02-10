import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <div className="w-20 h-20 relative">
        <Image
          src="/images/TCGLogo1.png"
          alt="Logo"
          width={80}
          height={80}
          quality={100}
          className="rounded-full object-cover"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
