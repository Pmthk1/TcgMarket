import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const DropdownListmenu: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isAuctionsOpen, setIsAuctionsOpen] = useState(false);
  const [isBidsOpen, setIsBidsOpen] = useState(false);

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
          <DropdownMenuLabel className="text-lg font-semibold text-gray-700 px-3 py-2">
            My Account
          </DropdownMenuLabel>
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

            {/* Auctions */}
            <DropdownMenuItem
              className="flex justify-between items-center px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsAuctionsOpen(!isAuctionsOpen);
              }}
            >
              Auctions {isAuctionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </DropdownMenuItem>
            {isAuctionsOpen && (
              <div className="pl-6">
                <DropdownMenuItem asChild>
                  <Link href="/auctions/live" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                    Live Auctions
                  </Link>
                </DropdownMenuItem>
              </div>
            )}

            {/* Bids */}
            <DropdownMenuItem
              className="flex justify-between items-center px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsBidsOpen(!isBidsOpen);
              }}
            >
              Bids {isBidsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </DropdownMenuItem>
            {isBidsOpen && (
              <div className="pl-6">
                <DropdownMenuItem asChild>
                  <Link href="/bids/history" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                    Bid History
                  </Link>
                </DropdownMenuItem>
              </div>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => signOut()}
            >
              Logout
            </DropdownMenuItem>
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
