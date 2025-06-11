// Saving mechanism
// Server actions handle taking the chat details (title, content, tags, folderId) and saving them to the database
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

type UpdateChatPayload = {
  promptId: string;
  title?: string;
  tags?: string[];
  folderId?: string | null;
};

type UpdateChatResult = {
  success: boolean;
  message?: string;
};

export async function updateChat(
  payload: UpdateChatPayload
): Promise<UpdateChatResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  const { promptId, title, tags, folderId } = payload;

  if (!promptId) {
    return { success: false, message: "Prompt ID is required." };
  }

  const dataToUpdate: {
    title?: string;
    tags?: string[];
    folderId?: string | null;
  } = {};

  if (title !== undefined) {
    // Check if the title is empty after removing white spaces
    if (!title.trim()) {
      return { success: false, message: "Prompt title cannot be empty." };
    }
    dataToUpdate.title = title.trim();
  }

  if (tags !== undefined) {
    dataToUpdate.tags = tags.filter((tag) => tag.trim() !== ""); // Store as an array of strings, remove empty tags
  }

  if (folderId !== undefined) {
    dataToUpdate.folderId = folderId;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return { success: true, message: "No data to update." };
  }

  try {
    const prompt = await prisma.prompt.findUnique({
      where: {
        id: promptId,
        userId: userId, // Ensure the prompt belongs to the owner as well as the prompt exists
      },
    });

    if (!prompt) {
      return { success: false, message: "Prompt not found or access denied." };
    }

    await prisma.prompt.update({
      // confirm that the prompt belongs to the user
      where: {
        id: promptId,
      },
      data: dataToUpdate,
    });

    // Revalidate all the paths where this prompt might appear
    revalidatePath("/dashboard"); // Unfiled list
    if (prompt.folderId) {
      revalidatePath(`/dashboard/folders/${prompt.folderId}`);
    }

    if (dataToUpdate.folderId && dataToUpdate.folderId !== prompt.folderId) {
      revalidatePath(`/dashboard/folders/${dataToUpdate.folderId}`);
    }

    revalidatePath(`/dashboard/folders/${promptId}`);

    return {
      success: true,
      message: "Chat updated successfully!",
    };
  } catch (error) {
    console.error("Error updating chat:", error);
    return {
      success: false,
      message: "Failed to update chat. Please try again.",
    };
  }
}

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
