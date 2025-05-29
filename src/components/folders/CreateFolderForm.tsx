"use client";

import { useState, useTransition } from "react";
import { createFolder } from "@/src/lib/actions/folder.actions";
import { useRouter } from "next/navigation";

export default function CreateFolderForm() {
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
      <div>
        <label
          htmlFor="folderName"
          className="block text-sm font-medium text-gray-700 sr-only"
        >
          Folder Name
        </label>
        <input
          type="text"
          id="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isPending}
        />
      </div>
      <button
        type="submit"
        className="mt-3 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create Folder"}
      </button>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.startsWith("Failed") ||
            message.startsWith("A folder named") ||
            message.startsWith("Folder name cannot")
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
