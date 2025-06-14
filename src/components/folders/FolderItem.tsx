// This component will handle the display of a single folder and its rename functionality.
"use client";
import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { renameFolder, deleteFolder } from "@/src/lib/actions/folder.actions";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Folder {
  id: string;
  name: string;
}

interface FolderItemProps {
  folder: Folder;
}

export default function FolderItem({ folder }: FolderItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); // Pending state
  const [isDeleting, startDeleteTransition] = useTransition(); // Started the deleting process
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = async () => {
    setMessage(null);
    if (newName.trim() === folder.name) {
      setIsEditing(false);
      return; // No need to update if the name hasn't changed
    }
    if (!newName.trim()) {
      setMessage("Folder name cannot be empty.");
      return;
    }

    startTransition(async () => {
      const result = await renameFolder(folder.id, newName.trim());
      if (result.success) {
        setMessage(result.message || "Renamed successfully!");
        setIsEditing(false);
        // The revalidatePath in server action should update the list of folders
      } else {
        setMessage(result.message || "Failed to rename folder.");
      }
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleRename();
    } else if (event.key === "Escape") {
      setNewName(folder.name); // Reset to the original name
      setIsEditing(false);
      setMessage(null);
    }
  };

  const handleDelete = async () => {
    setMessage(null);
    startDeleteTransition(async () => {
      const result = await deleteFolder(folder.id);
      if (!result.success) {
        setMessage(result.message || "Failed to delete folder.");
      }
      setShowDeleteDialog(false);
    });
  };

  return (
    // The list item itself is styled to look like a card and acts as a flex container
    <>
      <li className="border rounded-lg shadow-sm flex items-center justify-between transition-colors hover:bg-muted/50 group">
        {isEditing ? (
          // When editing, the input and save/cancel buttons take up the whole space
          <div className="p-2 flex-grow flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              className="text-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRename}
              disabled={isPending}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        ) : (
          // In normal view, the link takes up most space, and buttons are separate
          <>
            <Link
              href={`/dashboard/folders/${folder.id}`}
              className="p-4 flex-grow text-lg font-semibold"
            >
              {folder.name}
            </Link>
            <div className="p-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-muted-foreground hover:text-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-muted-foreground hover:text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </Button>
            </div>
          </>
        )}
      </li>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this folder?
            </DialogTitle>
            <DialogDescription>
              You are about to delete the folder named &quot;{folder.name}
              &quot;. Chats inside this folder will become unfiled, but they
              will not be deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button
              variant={"destructive"}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
