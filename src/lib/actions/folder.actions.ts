"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../db";

import { revalidatePath } from "next/cache";

type CreateFolderResult = {
  success: boolean;
  message?: string;
  folder?: { id: string; name: string };
};

export async function createFolder(
  folderName: string
): Promise<CreateFolderResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  const name = folderName.trim();

  if (!name) {
    return {
      success: false,
      message: "Folder name cannot be empty.",
    };
  }

  try {
    // Check if a folder with the same name already exists for this user
    const existingFolder = await prisma.folder.findFirst({
      where: {
        userId: userId,
        name: name,
      },
    });

    if (existingFolder) {
      return {
        success: false,
        message: `A folder named ${name} already exists.`,
      };
    }

    const newFolder = await prisma.folder.create({
      data: {
        userId: userId,
        name: name,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Folder created successfully!",
      folder: { id: newFolder.id, name: newFolder.name },
    };
  } catch (error) {
    console.error("Error creating folder:", error);
    // Differentiate between errors
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      return {
        success: false,
        message: `A folder named "${name}" already exists.`,
      };
    }

    return {
      success: false,
      message: "Failed to create folder. Please try again.",
    };
  }
}
