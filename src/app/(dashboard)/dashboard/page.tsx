import { auth } from "@clerk/nextjs/server"; // to get the userId on the server
import { redirect } from "next/navigation";
import prisma from "@/src/lib/db";
import Link from "next/link";
import CreateFolderForm from "@/src/components/folders/CreateFolderForm";
import FolderItem from "@/src/components/folders/FolderItem";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

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
    <div>
      <div className="flex justify-end mb-6">
        {/* <h1 className="text-3xl font-bold mb-6">Your Vault</h1> */}

        <Button className="self-end">
          <Link href="/dashboard/prompts/new">Save New Chat</Link>
        </Button>
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
                <FolderItem key={folder.id} folder={folder} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Render your folders here (Placeholder)*/}

      <h2 className="text-2xl font-semibold mb-4 mt-8">Unfiled Chats</h2>
      {unfiledPrompts.length === 0 ? (
        <p className="text-muted-foreground">No unfiled chats.</p>
      ) : (
        <ul className="space-y-4">
          {unfiledPrompts.map((prompt) => (
            <li key={prompt.id}>
              <Link href={`/dashboard/prompts/${prompt.id}`} className="block">
                <Card className="hover:border-primary transition-colors flex flex-col h-full p-2">
                  <CardHeader className="p-0 px-1">
                    <CardTitle>{prompt.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 px-1 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {prompt.content}
                    </p>
                  </CardContent>
                  <CardFooter className="p-0 flex flex-wrap gap-1">
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </CardFooter>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
