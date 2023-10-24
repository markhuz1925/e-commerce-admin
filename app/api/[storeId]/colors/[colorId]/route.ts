import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId)
      return NextResponse.json("Color ID is required", { status: 400 });

    const color = await prisma.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const { name, value } = body;

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!name) return NextResponse.json("Name is required", { status: 400 });

    if (!value) return NextResponse.json("Value is required", { status: 400 });

    if (!params.colorId)
      return NextResponse.json("Color ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    const color = await prisma.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!params.colorId)
      return NextResponse.json("Color ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    const color = await prisma.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
