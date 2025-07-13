// src/app/(dashboard)/dashboard/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the userId. We know this part works correctly in your app.
  const { userId } = await auth();

  // 2. If there is no userId, the user is not logged in.
  if (!userId) {
    // 3. Redirect them to the landing page.
    redirect("/sign-in");
  }

  // If the user is logged in, render the page they requested.
  return <>{children}</>;
}
