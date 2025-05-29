import { auth } from "@clerk/nextjs/server"; // to get the userId on the server
import { redirect } from "next/navigation";
import prisma from "@/src/lib/db";
import Link from "next/link";
import CreateFolderForm from "@/src/components/folders/CreateFolderForm";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
    // return <div>Sign in to view this page</div>;
  }

  const prompts = await prisma.prompt.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc", // descending order (newest first)
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">Your Prompts & Folders</h1>
        <Link
          href="/dashboard/prompts/new"
          className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Save New Chat
        </Link>
      </div>

      <div className="mb-8">
        <CreateFolderForm />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Folders</h2>
      {/* Render your folders here (Placeholder)*/}
      <p className="text-gray-500">Folder listing will go here.</p>

      <h2 className="text-2xl font-semibold mb-4 mt-8">Unfiled Chats</h2>
      {prompts.length === 0 ? (
        <p>
          You have not created any prompts yet. Click &quot;Save New Chat&quot;
          to get started.
        </p>
      ) : (
        <ul className="space-y-4">
          {prompts.map((prompt) => (
            <li key={prompt.id} className="p-4 border rounded-lg shadow">
              <h2 className="text-lg font-semibold">{prompt.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {/* Show a snippet of the content or other details */}
                {prompt.content.substring(0, 100)}
                {prompt.content.length > 100 ? "..." : ""}
              </p>
              <div className="mt-2">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {/* Add edit/delete buttons here later */}
            </li>
          ))}
        </ul>
      )}
      {/* Add "Create New Prompt" button/link here later*/}
    </div>
  );
}
