"use client";

import Logo from "./Logo";
import DropdownListmenu from "./DropdownListmenu";
import Cart from "./Cart";

const Navbar = () => {
  return (
    <nav className="bg-sky-50 w-full border-b border-gray-200 py-4">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Logo />

        {/* Right Side Menu */}
        <div className="flex items-center gap-4 relative mt-3">
          <Cart />
          <DropdownListmenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
