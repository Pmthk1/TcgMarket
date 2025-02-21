import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/auctions(.*)",
  "/Card(.*)",
  "/checkout(.*)", // ต้องล็อกอินก่อนเข้า
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)", // ป้องกันเฉพาะ role=admin
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, redirectToSignIn } = await auth(); 

  if (isProtectedRoute(req) && !sessionClaims) {
    return redirectToSignIn(); 
  }

  if (isAdminRoute(req)) {
    if (!sessionClaims) {
      return new Response("Unauthorized", { status: 401 });
    }

    // ✅ ใช้ TypeScript Safe Access ป้องกัน `role` เป็น `undefined`
    const metadata = sessionClaims.publicMetadata as Record<string, unknown> | undefined;
    const role = metadata?.role as string | undefined;

    if (role !== "admin") {
      return new Response("Forbidden", { status: 403 }); 
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
