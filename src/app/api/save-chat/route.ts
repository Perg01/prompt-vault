// API route responsible for receiving the data from chrome extension and saving it to the database
"use server";

import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();
    const { title, content, tags, folderId } = body;

    if (!title || !content) {
      return new NextResponse(
        JSON.stringify({ message: "Title and content are required" }),
        { status: 400 }
      );
    }

    // Save the chat to the database
    const newPrompt = await prisma.prompt.create({
      data: {
        userId: userId,
        title: title.trim(),
        content: content.trim(),
        tags: tags ? tags.filter((tag: string) => tag.trim() !== "") : [], // Store as an array of strings, remove empty tags
        folderId: folderId || null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Chat saved successfully!", prompt: newPrompt },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API/SAVE_CHAT] Error:", error);

    if (error instanceof SyntaxError) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid JSON body." }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "An internal error occurred." }),
      { status: 500 }
    );
  }
}
