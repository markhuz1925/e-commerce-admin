import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const { label, imageUrl } = body;

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!label) return NextResponse.json("Label is required", { status: 400 });

    if (!imageUrl)
      return NextResponse.json("Image URL is required", { status: 400 });

    if (!params.storeId)
      return NextResponse.json("Store ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return NextResponse.json("Store ID is required", { status: 400 });

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
