import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Import จากไฟล์ที่แยกไว้

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
