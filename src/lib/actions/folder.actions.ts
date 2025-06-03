"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

type DeleteFolderResult = {
  success: boolean;
  message?: string;
};

type RenameFolderResult = {
  success: boolean;
  message?: string;
  folder?: { id: string; name: string };
};

export async function renameFolder(
  folderId: string,
  newName: string
): Promise<RenameFolderResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  const trimmedNewName = newName.trim();

  if (!folderId) {
    return { success: false, message: "Folder ID is required." };
  }

  if (!trimmedNewName) {
    return { success: false, message: "Folder name cannot be empty." };
  }

  try {
    // Check if the folder exists and also belongs to the same user
    const folderToRename = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: userId,
      },
    });

    if (!folderToRename) {
      return { success: false, message: "Folder not found or access denied." };
    }

    // Check if the new folder name already exists for this user
    if (trimmedNewName.toLowerCase() !== folderToRename.name.toLowerCase()) {
      const existingFolderWithNewName = await prisma.folder.findFirst({
        where: {
          userId: userId,
          name: trimmedNewName,
          id: { not: folderId }, // Exclude the current folder from check
        },
      });

      if (existingFolderWithNewName) {
        return {
          success: false,
          message: `A folder named "${trimmedNewName}" already exists`,
        };
      }
    }

    // finally update the folder name
    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: trimmedNewName,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/folders/${folderId}`);

    return {
      success: true,
      message: "Folder renamed successfully!",
      folder: { id: updatedFolder.id, name: updatedFolder.name },
    };
  } catch (error) {
    console.error("Error renaming folder:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      // Handle potential unique constraint violation if our manual check missed something (race condition, case sensitivity differences in DB vs. check)
      if (error.code === "P2002") {
        // Unique constraint failed
        return {
          success: false,
          message: `A folder named "${trimmedNewName}" already exists.`,
        };
      }
    }
    return {
      success: false,
      message: "Failed to rename folder. Please try again.",
    };
  }
}

export async function deleteFolder(
  folderId: string
): Promise<DeleteFolderResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  if (!folderId) {
    return { success: false, message: "Folder ID is required." };
  }

  try {
    const folderToDelete = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: userId, // Ensure the folder belongs to the owner and not someone else
      },
    });

    if (!folderToDelete) {
      return { success: false, message: "Folder not found or access denied." };
    }

    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Folder deleted successfully!",
    };
  } catch (error) {
    console.error("Error deleting folder:", error);
    return {
      success: false,
      message: "Failed to delete folder. Please try again.",
    };
  }
}
