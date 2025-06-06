// Server component that fetches the folders and renders your new SaveChatForm component.
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/src/lib/db";
import SaveChatForm from "@/src/components/prompts/SaveChatForm";

export default async function NewPromptPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Vault
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Save New Chat</h1>

      {/* Render the client component form and pass the fetched folders as a prop */}
      <SaveChatForm folders={folders} />
    </div>
  );
}
