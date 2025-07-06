// API Endpoint to provide the list of folders for the currently logged in user.
// The list is provided to the popup window once the save button is clicked on ChatGPT.
import { auth } from "@clerk/nextjs/server";
import prisma from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const folders = await prisma.folder.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(folders);
  } catch (error) {
    console.error("[API/FOLDERS] Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching folders" }),
      { status: 500 }
    );
  }
}
