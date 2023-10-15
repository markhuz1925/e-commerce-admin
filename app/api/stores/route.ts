import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const { name } = body;

    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });
    if (!name) return NextResponse.json("Name is required", { status: 400 });

    const store = await prisma.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
