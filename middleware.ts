// middleware.ts
import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient as getClerkClient,
} from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

// ต้องล็อกอินก่อนถึงเข้าได้
const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/auctions(.*)",
  "/Card(.*)",
  "/checkout(.*)",
]);

// สำหรับแอดมินเท่านั้น
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // อ่านสถานะเซสชันครั้งเดียว
  const { userId, redirectToSignIn } = await auth();

  // ถ้าเป็นเส้นทางที่ต้องล็อกอิน แต่ยังไม่ได้ล็อกอิน -> ส่งไปหน้า Sign In
  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn();
  }

  // ตรวจสิทธิ์แอดมิน
  if (isAdminRoute(req)) {
    if (!userId) {
      return redirectToSignIn();
    }

    try {
      // clerkClient เป็น async function -> ต้อง await ก่อนใช้
      const clerk = await getClerkClient();
      const user = await clerk.users.getUser(userId);

      const role = user.publicMetadata?.role as string | undefined;
      if (role !== "admin") {
        return new Response("Forbidden", { status: 403 });
      }
    } catch (error) {
      console.error("Error fetching user from Clerk:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // ผ่านได้
  return;
});

// ให้ middleware ทำงานทุก route ยกเว้นไฟล์ asset
export const config = {
  matcher: [
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
