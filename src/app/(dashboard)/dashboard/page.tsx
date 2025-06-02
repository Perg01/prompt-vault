import { auth } from "@clerk/nextjs/server"; // to get the userId on the server
import { redirect } from "next/navigation";
import prisma from "@/src/lib/db";
import Link from "next/link";
import CreateFolderForm from "@/src/components/folders/CreateFolderForm";
import FolderItem from "@/src/components/folders/FolderItem";

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
                // <li
                //   key={folder.id}
                //   className="p-3 border rounded-lg shadow-sm hover:bg-gray-700 flex justify-between items-center"
                // >
                //   <Link
                //     href={`/dashboard/folders/${folder.id}`}
                //     className="text-lg hover:underline"
                //   >
                //     {folder.name}
                //   </Link>
                //   {/* Placeholder for Rename/Delete folder buttons */}
                //   <div className="space-x-2">
                //     <button className=" ">
                //       <svg
                //         xmlns="http://www.w3.org/2000/svg"
                //         fill="none"
                //         viewBox="0 0 24 24"
                //         strokeWidth={1.5}
                //         stroke="currentColor"
                //         className="size-6 text-blue-500 hover:text-blue-400"
                //       >
                //         <path
                //           strokeLinecap="round"
                //           strokeLinejoin="round"
                //           d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                //         />
                //       </svg>
                //     </button>

                //     <button>
                //       <svg
                //         xmlns="http://www.w3.org/2000/svg"
                //         fill="none"
                //         viewBox="0 0 24 24"
                //         strokeWidth={1.5}
                //         stroke="currentColor"
                //         className="size-6 hover:text-red-400 text-red-500"
                //       >
                //         <path
                //           strokeLinecap="round"
                //           strokeLinejoin="round"
                //           d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                //         />
                //       </svg>
                //     </button>
                //   </div>
                // </li>

                <FolderItem key={folder.id} folder={folder} />
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
