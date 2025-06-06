// Saving mechanism
// Server actions handle taking the chat details (title, content, tags, folderId)  and saving them to the database
"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../db";
import { revalidatePath } from "next/cache";

type SaveChatPayload = {
  title: string;
  content: string;
  tags: string[];
  folderId?: string | null; // optional
};

type SaveChatResult = {
  success: boolean;
  message?: string;
  prompt?: { id: string; title: string };
};

export async function saveChat(
  payload: SaveChatPayload
): Promise<SaveChatResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  const { title, content, tags, folderId } = payload;

  if (!title.trim()) {
    return { success: false, message: "Prompt title cannot be empty." };
  }

  if (!content.trim()) {
    return { success: false, message: "Prompt content cannot be empty." };
  }

  try {
    const newPrompt = await prisma.prompt.create({
      data: {
        userId: userId,
        title: title.trim(),
        content: content.trim(),
        tags: tags ? tags.filter((tag) => tag.trim() !== "") : [], // Store as an array of strings, remove empty tags
        folderId: folderId || null,
      },
    });

    // Revalidate the dashboard and folder page
    revalidatePath("/dashboard");
    if (folderId) {
      revalidatePath(`/dashboard/folders/${folderId}`);
    }

    return {
      success: true,
      message: "Prompt saved successfully!",
      prompt: { id: newPrompt.id, title: newPrompt.title },
    };
  } catch (error) {
    console.error("Error saving prompt:", error);
    return {
      success: false,
      message: "Failed to save prompt. Please try again.",
    };
  }
}

export default saveChat;
