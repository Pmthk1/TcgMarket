import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";

async function authorizeUser(credentials: { email: string; password: string }) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  }) as { id: string; email: string; username: string; password: string; role: string; clerkId?: string } | null;

  if (!user || !user.password) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }

  return { 
    id: user.id, 
    email: user.email, 
    username: user.username, 
    role: user.role, 
    clerkId: user.clerkId ?? undefined, 
    accessToken: `mock-token-${user.id}` // จำลอง Access Token
  };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return await authorizeUser(credentials as { email: string; password: string });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.email = user.email ?? undefined;
        token.clerkId = user.clerkId ?? undefined;
        token.accessToken = user.accessToken;
      }
      return token as JWT;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          role: token.role as string,
          email: token.email ?? undefined,
          clerkId: token.clerkId ?? undefined,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
