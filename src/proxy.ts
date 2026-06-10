import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks(.*)",
  "/select-role(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isOwnerRoute = createRouteMatcher([
  "/owner(.*)",
  "/onboarding/owner(.*)",
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  if (userId && request.nextUrl.pathname === "/") {
    if (role === "owner") {
      return NextResponse.redirect(new URL("/owner", request.url));
    }
    if (role === "customer") {
      return NextResponse.redirect(new URL("/marketplace", request.url));
    }
    // if role is undefined, fall through — client page.tsx can handle via Firebase
  }

  if (!isPublicRoute(request)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // ── C) Only block /owner if we KNOW they're not an owner
    if (isOwnerRoute(request) && role && role !== "owner") {
      return NextResponse.redirect(new URL("/marketplace", request.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
