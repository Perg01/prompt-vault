// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api(.*)"]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl.pathname;

  console.log("Middleware - URL:", url);
  console.log("Middleware - User ID:", !!userId);

  if (isAuthRoute(req) && userId) {
    console.log(
      "Middleware - User is already signed in, redirecting to dashboard..."
    );
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute(req) && !userId) {
    console.log(
      "Middleware - Unauthenticated user accessing protected route, redirecting to home"
    );
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log("Middleware - Allowing request...");
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   // Only protect dashboard routes
//   if (isProtectedRoute(req)) {
//     const { userId } = await auth();
//     if (!userId) {
//       // Redirect to home page instead of sign-in
//       const homeUrl = new URL("/", req.url);
//       return Response.redirect(homeUrl);
//     }
//   }
// });

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };
