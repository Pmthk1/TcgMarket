import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    username: string;
    role: string;
    email?: string;
    clerkId?: string;
    accessToken?: string; // ✅ เพิ่ม accessToken ใน User
  }

  interface Session extends DefaultSession {
    user: User;
    accessToken?: string; // ✅ เพิ่ม accessToken ใน Session
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: string;
    email?: string;
    clerkId?: string;
    accessToken?: string; // ✅ เพิ่ม accessToken ใน JWT
  }
}
