"use client";

import { AlignLeft, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { links } from "@/utils/link";
import Link from "next/link";
import SignOutLinks from "./SignOutLinks";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

const DropdownListmenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <AlignLeft />
          <UserRound />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <SignedIn>
          <DropdownMenuSeparator />
          {links.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex items-center gap-2">
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
          <SignOutLinks />
        </SignedIn>

        <SignedOut>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <SignInButton>
              <button className="w-full text-left">Sign In</button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <SignUpButton>
              <button className="w-full text-left">Sign Up</button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownListmenu;
