// This server component will fetch the chat details that are already saved in the database and render your ChatEditForm component
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/src/lib/db";
import ChatEditForm from "@/src/components/prompts/ChatEditForm";
import Link from "next/link";

type PromptPageProps = {
  params: {
    promptId: string;
  };
};

export default async function PromptPage({ params }: PromptPageProps) {
  const { userId } = await auth();
  const { promptId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const chatDetails = await prisma.prompt.findUnique({
    where: {
      id: promptId,
      userId: userId,
    },
    include: {
      folder: true,
    },
  });

  if (!chatDetails) {
    redirect("/dashboard");
  }

  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Link
          href={
            chatDetails.folderId
              ? `/dashboard/folders/${chatDetails.folderId}`
              : "/dashboard"
          }
          className="text-blue-500 hover:text-blue-700"
        >
          &larr; Back to {chatDetails.folderId ? "Folder" : "Vault"}
        </Link>
      </div>

      <ChatEditForm prompt={chatDetails} folders={folders} />
    </div>
  );
}
