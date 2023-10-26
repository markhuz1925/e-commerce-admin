import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId)
      return NextResponse.json("Category ID is required", { status: 400 });

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const { name, billboardId } = body;

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!name) return NextResponse.json("Name is required", { status: 400 });

    if (!billboardId)
      return NextResponse.json("Billboard ID is required", { status: 400 });

    if (!params.categoryId)
      return NextResponse.json("Category ID is required WEH", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    const category = await prisma.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!params.categoryId)
      return NextResponse.json("Category ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    const category = await prisma.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
