// This component will handle saving chats and displaying them in the vault.
// Also this component will contain the form logic, manage user input, and call saveChat server action.

"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { saveChat } from "@/src/lib/actions/prompt.actions";

type Folder = {
  id: string;
  name: string;
};

interface SaveChatFormProps {
  folders: Folder[];
}

export default function SaveChatForm({ folders }: SaveChatFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the pre-selected folderId from the URL query, if it exists
  const initialFolderId = searchParams.get("folderId") || "";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [folderId, setFolderId] = useState(initialFolderId);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const result = await saveChat({
        title,
        content,
        tags: tagsArray,
        folderId: folderId || null,
      });

      // On success, redirect to the folder if one was selected, otherwise to the dashboard
      if (result.success) {
        const redirectPath = result.prompt?.id
          ? folderId
            ? `/dashboard/folders/${folderId}`
            : "/dashboard"
          : "/dashboard";
        router.push(redirectPath);
      } else {
        setMessage(result.message || "An error occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Chat Title
        </label>
        <input
          type="text"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Content Textarea */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font medium text-gray-700"
        >
          Chat Content (Paste Here)
        </label>
        <textarea
          name="content"
          id="content"
          rows={10}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Paste your entire prompt and response conversation here."
        ></textarea>
      </div>

      {/* Folder Select Dropdown */}
      <div>
        <label
          htmlFor="folderId"
          className="block text-sm font-medium text-gray-700"
        >
          Folder (Optional)
        </label>
        <select
          name="folderId"
          id="folderId"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Unfiled</option>
          {folders.map((folder) => (
            <option value={folder.id} key={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Input */}
      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700"
        >
          Tags(comma-separated)
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., code, writing, ideas"
        />
      </div>

      {/* Submit button & message */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isPending ? "Saving..." : "Save Chat to Vault"}
        </button>
      </div>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
