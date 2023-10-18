import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const { name } = body;

    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });

    if (!name) return NextResponse.json("Name is required", { status: 400 });

    if (!params.storeId)
      return NextResponse.json("Store ID is required", { status: 400 });

    const store = await prisma.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log("[STORES_PATCH]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return NextResponse.json("Unauthorized", { status: 401 });

    if (!params.storeId)
      return NextResponse.json("Store ID is required", { status: 400 });

    const store = await prisma.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log("[STORES_DELETE]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
