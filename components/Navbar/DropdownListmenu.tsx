"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import SignOutLinks from "./SignOutLinks";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";

const DropdownListmenu: React.FC = () => {
  const { user } = useUser();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="relative mt-1">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex items-center justify-center focus:outline-none">
          {user ? (
            <Image
              src={user.imageUrl}
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full border border-gray-300"
              priority
            />
          ) : (
            <User className="w-8 h-10 text-black-500" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md w-52 p-2">
          <DropdownMenuLabel className="text-lg font-semibold text-gray-700 px-3 py-2">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <SignedIn>
            <DropdownMenuItem asChild>
              <Link href="/" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                Home
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/profile" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/products" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                Products
              </Link>
            </DropdownMenuItem>

            <div className="relative">
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-800 flex justify-between items-center hover:bg-gray-100 rounded-md"
                onClick={() => toggleMenu("auctions")}
              >
                Auctions {openMenu === "auctions" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openMenu === "auctions" && (
                <div className="pl-5 mt-1 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link href="/auctions/live" className="block px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">
                      กำลังประมูล
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auctions/won" className="block px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">
                      ประมูลที่ชนะ
                    </Link>
                  </DropdownMenuItem>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-800 flex justify-between items-center hover:bg-gray-100 rounded-md"
                onClick={() => toggleMenu("bids")}
              >
                Bids {openMenu === "bids" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openMenu === "bids" && (
                <div className="pl-5 mt-1 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link href="/bids/history" className="block px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">
                      ประวัติการประมูล
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bids/active" className="block px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">
                      กำลังเสนอราคา
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bids/lost" className="block px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md">
                      แพ้การประมูล
                    </Link>
                  </DropdownMenuItem>
                </div>
              )}
            </div>

            <DropdownMenuItem asChild>
              <Link href="/payments" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                Payments
              </Link>
            </DropdownMenuItem>

            <SignOutLinks />
          </SignedIn>

          <SignedOut>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <SignInButton mode="modal">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                  Sign In
                </button>
              </SignInButton>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <SignUpButton mode="modal">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                  Sign Up
                </button>
              </SignUpButton>
            </DropdownMenuItem>
          </SignedOut>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownListmenu;
