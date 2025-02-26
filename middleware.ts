import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextRequest } from "next/server"; // ✅ Import NextRequest

const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/auctions(.*)",
  "/Card(.*)",
  "/checkout(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => { // ✅ กำหนด type ให้ req
  const session = await auth();

  if (!session) {
    console.log("🚫 No session found, skipping middleware");
    return;
  }

  const { sessionClaims, redirectToSignIn, userId } = session;

  console.log("🔍 Middleware Debug: Checking Request for", req.nextUrl.pathname);
  console.log("📌 Session Claims:", JSON.stringify(sessionClaims, null, 2));

  if (isProtectedRoute(req) && !sessionClaims) { // ✅ ใช้ req แทน req.nextUrl.pathname
    console.log("🔒 Protected Route: User not authenticated");
    return redirectToSignIn();
  }

  if (isAdminRoute(req)) { // ✅ ใช้ req แทน req.nextUrl.pathname
    if (!userId) {
      console.log("🚫 Unauthorized: No session claims found");
      return new Response("Unauthorized", { status: 401 });
    }

    // ดึงข้อมูลผู้ใช้จาก Clerk Backend SDK
    let metadata;
    try {
      const user = await clerkClient.users.getUser(userId);
      metadata = user.publicMetadata;
      console.log("🛠️ User Data from Clerk:", JSON.stringify(user, null, 2));
    } catch (error) {
      console.error("❌ Error fetching user from Clerk:", error);
      return new Response("Internal Server Error", { status: 500 });
    }

    const role = metadata?.role as string | undefined;
    console.log("🔎 Checking Admin Role:", role);

    if (role !== "admin") {
      console.log("🚫 Access Denied: User is not admin");
      return new Response("Forbidden", { status: 403 });
    }
  }

  return;
});

export const config = {
  matcher: [
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
