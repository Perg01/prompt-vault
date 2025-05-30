import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/src/lib/db";

// Next.js passes URL parameters to Server Components this way.
type FolderPageProps = {
  params: {
    folderId: string;
  };
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { userId } = await auth();
  const { folderId } = params;

  if (!userId) {
    redirect("/sign-in");
  }

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
      userId: userId,
    },
    include: {
      prompts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // If folder not found or doesn't belong to user
  if (!folder) {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-6">
        <Link href={"/dashboard"} className="text-blue-500 hover:text-blue-700">
          &larr; Back to Dashboard
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-1">Folder: {folder.name}</h1>
      <p>Created on: {new Date(folder.createdAt).toLocaleDateString()}</p>

      {folder.prompts.length === 0 ? (
        <p>Folder is empty. Save new chats to this folder.</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Chats in this folder</h2>
          <ul className="space-y-4">
            {folder.prompts.map((prompt) => (
              <li key={prompt.id} className="p-4 border rounded-lg shadow">
                <h3 className="text-lg font-semibold">{prompt.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {prompt.content.substring(0, 100)}
                  {prompt.content.length > 100 ? "..." : ""}
                </p>
                <div className="mt-2">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {/* Placeholder for chat actions (view full, edit metadata, delete) */}
              </li>
            ))}
          </ul>
        </>
      )}
      {/* Link to save a new chat, potentially pre-filling this folder */}
      <div className="mt-8">
        <Link
          href={`/dashboard/prompts/new?folderId=${folder.id}`}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save New Chat to &quot;{folder.name}&quot;
        </Link>
      </div>
    </div>
  );
}
