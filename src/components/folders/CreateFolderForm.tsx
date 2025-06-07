"use client";

import { useState, useTransition } from "react";
import { createFolder } from "@/src/lib/actions/folder.actions";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import prisma from "@/src/lib/db";

export default function CreateFolderForm() {
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!folderName.trim()) {
      setMessage("Folder name cannot be empty.");
      return;
    }

    startTransition(async () => {
      const result = await createFolder(folderName.trim());

      if (result.success) {
        setMessage(result.message || "Folder created successfully!");
        setFolderName("");
      } else {
        setMessage(result.message || "Failed to create folder.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-3">Create New Folder</h2>
      <div className="space-y-2">
        <Label htmlFor="folderName">Folder Name</Label>
        <Input
          type="text"
          id="folderName"
          name="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="e.g., Marketing Ideas"
          required
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="mt-3 w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create Folder"}
      </Button>

      {message && (
        <p
          className={`mt-3 text-sm ${
            message.includes("Failed") || message.includes("already exists")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
