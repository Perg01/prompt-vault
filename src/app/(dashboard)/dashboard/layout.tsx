// src/app/(dashboard)/dashboard/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    // Temporarily comment out redirect for testing
    // redirect("/");
    return <div>Please sign in to access the dashboard</div>;
  }

  return <>{children}</>;
}
