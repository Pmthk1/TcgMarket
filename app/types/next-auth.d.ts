import type { DefaultSession, DefaultUser } from "next-auth"; // ✅ เอา NextAuth ออก
import type { JWT as DefaultJWT } from "next-auth/jwt"; // ✅ Import type เท่านั้น

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    username: string;
    role: string;
    email?: string;
    clerkId?: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: string;
    email?: string;
    clerkId?: string;
  }
}
