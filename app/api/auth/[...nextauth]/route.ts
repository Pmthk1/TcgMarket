import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import type { JWT } from "next-auth/jwt"; // ✅ Import type ให้ TypeScript รู้จัก JWT

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            clerkId: true,
          },
        });

        if (!user) throw new Error("Invalid email or password");

        return user;
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
      }
      return token as JWT;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        username: token.username as string,
        role: token.role as string,
        email: token.email ?? undefined,
        clerkId: token.clerkId ?? undefined,
      };
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handlers = NextAuth(authOptions);
export { handlers as GET, handlers as POST };
