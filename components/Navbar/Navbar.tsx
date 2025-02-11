"use client";  // เพิ่มบรรทัดนี้เพื่อระบุว่าเป็น Client Component

import SearchBar from "./Search";
import Logo from "./Logo";
import DropdownListmenu from "./DropdownListmenu";
import Cart from "./Cart";

const Navbar = () => {
  return (
    <nav className="bg-sky-50 w-full border-b py-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo />
          <SearchBar />
        </div>
        <div className="flex gap-4">
          <Cart />
          <DropdownListmenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
