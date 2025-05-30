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

  // Fetches folder for the current user
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetches prompts that are not in a folder
  const unfiledPrompts = await prisma.prompt.findMany({
    where: {
      userId: userId,
      folderId: null,
    },
    orderBy: {
      createdAt: "desc", // descending order (newest first)
    },
  });

  return (
    <div className="bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">Your Vault</h1>
        <Link
          href="/dashboard/prompts/new"
          className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Save New Chat
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CreateFolderForm />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Folders</h2>
          {folders.length === 0 ? (
            <p className="text-gray-500">
              You haven&lsquo;t created any folders yet. Use the form to create
              one!
            </p>
          ) : (
            <ul className="space-y-2">
              {folders.map((folder) => (
                <li
                  key={folder.id}
                  className="p-3 border rounded-lg shadow-sm hover:bg-gray-700 flex justify-between items-center"
                >
                  <Link
                    href={`/dashboard/folders/${folder.id}`}
                    className="text-lg hover:underline"
                  >
                    {folder.name}
                  </Link>
                  {/* Placeholder for Rename/Delete folder buttons */}
                  <div className="space-x-2">
                    <button className="text-xs text-blue-500 hover:underline">
                      Rename
                    </button>
                    <button className="text-xs text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Render your folders here (Placeholder)*/}

      <h2 className="text-2xl font-semibold mb-4 mt-8">Unfiled Chats</h2>
      {unfiledPrompts.length === 0 ? (
        <p className="text-gray-500">No unfiled chats.</p>
      ) : (
        <ul className="space-y-4">
          {unfiledPrompts.map((prompt) => (
            <li key={prompt.id} className="p-4 border rounded-lg shadow">
              <h2 className="text-lg font-semibold">{prompt.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
