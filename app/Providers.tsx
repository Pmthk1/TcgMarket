"use client";

import { SessionProvider } from "next-auth/react";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/components/context/CartContext";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/toaster";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <SessionProvider>
        <CartProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </CartProvider>
      </SessionProvider>
    </ClerkProvider>
  );
};

export default Providers;
