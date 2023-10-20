import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId)
      return NextResponse.json("Billboard ID is required", { status: 400 });

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const { label, imageUrl } = body;

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!label) return NextResponse.json("Label is required", { status: 400 });

    if (!imageUrl)
      return NextResponse.json("Image UrL is required", { status: 400 });

    if (!params.billboardId)
      return NextResponse.json("Billboard ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!params.billboardId)
      return NextResponse.json("Billboard ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
