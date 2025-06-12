// UI component that displays the full content of a single chat, and it also has the editing mode
// to let you change that chat's title, tags, and folder

"use client";

import { useState, useTransition } from "react";
import { updateChat } from "@/src/lib/actions/prompt.actions";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for the props we'll pass from the server to the client
type Prompt = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folderId: string | null;
  createdAt: Date;
};

type Folder = {
  id: string;
  name: string;
};

interface ChatEditFormProps {
  prompt: Prompt;
  folders: Folder[];
}

export default function ChatEditForm({ prompt, folders }: ChatEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(prompt.title);
  const [tags, setTags] = useState(prompt.tags.join(", "));
  const [folderId, setFolderId] = useState(prompt.folderId || "unfiled");

  const [message, setMessage] = useState<string | null>(null);

  const handleSaveChanges = async () => {
    setMessage(null);
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    startTransition(async () => {
      const result = await updateChat({
        promptId: prompt.id,
        title: title,
        tags: tagsArray,
        folderId: folderId === "unfiled" ? null : folderId,
      });

      if (result.success) {
        setIsEditing(false);
        setMessage(result.message || "Changes saved successfully!");
      } else {
        setMessage(
          result.message || "Failed to save changes. An error occurred"
        );
      }
    });
  };
  const handleCancel = () => {
    setTitle(prompt.title);
    setTags(prompt.tags.join(", "));
    setFolderId(prompt.folderId || "");
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <Card>
      <CardHeader>
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        ) : (
          <CardTitle className="text-3xl">{prompt.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-foreground whitespace-pre-wrap font-mono text-sm">
          {prompt.content}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {isEditing ? (
          <>
            <div className="w-full space-y-2">
              <Label htmlFor="folderId">Folder</Label>
              <Select onValueChange={setFolderId} defaultValue={folderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unfiled">Unfiled</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Saved on: {new Date(prompt.createdAt).toLocaleDateString()}
            </div>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </>
        )}
        {/* Action Buttons */}
        <div className="mt-6 flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSaveChanges} disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Chat</Button>
          )}
        </div>
        {message && (
          <p
            className={`mt-2 text-sm ${
              message.includes("Failed") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
