import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/src/lib/db";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Next.js passes URL parameters to Server Components this way.
type FolderPageProps = {
  params: Promise<{
    folderId: string;
  }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { userId } = await auth();
  const { folderId } = await params;

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
      <h1 className="text-3xl font-bold mb-1"> {folder.name}</h1>
      <p className="text-sm text-gray-600 mb-3">
        Created on: {new Date(folder.createdAt).toLocaleDateString()}
      </p>

      {folder.prompts.length === 0 ? (
        <p className="mt-6">Folder is empty. Save new chats to this folder.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {folder.prompts.map((prompt) => (
            // Wrap the Card with a Link component
            <Link href={`/dashboard/prompts/${prompt.id}`} key={prompt.id}>
              <Card className="flex flex-col h-full hover:border-primary transition-colors p-2">
                <CardHeader className="p-0 px-1">
                  <CardTitle>{prompt.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-1 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {prompt.content}
                  </p>
                </CardContent>
                <CardFooter className="p-0 flex flex-wrap gap-1">
                  {prompt.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {/* Link to save a new chat, potentially pre-filling this folder */}
      <div className="mt-8">
        <Button>
          <Link
            href={`/dashboard/prompts/new?folderId=${folder.id}`}
            // className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {/* Save New Chat to &quot;{folder.name}&quot; */}
            Add to this Folder
          </Link>
        </Button>
      </div>
    </div>
  );
}
