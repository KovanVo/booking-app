import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", // homepage
  "/api/webhooks(.*)",
  "/select-role(.*)",
  "/sign-up(.*)",
  "/sign-in(.*)" // VERY IMPORTANT (allow Clerk webhook)
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const authObject = await auth();
    authObject.redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
