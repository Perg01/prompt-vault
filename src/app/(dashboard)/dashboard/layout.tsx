// src/app/(dashboard)/dashboard/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // If there is no userId, redirect to the dedicated sign-in page.
  if (!userId) {
    redirect("/");
  }

  // If the user is logged in, show the page.
  return <>{children}</>;
}
