import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId)
      return NextResponse.json("Product ID is required", { status: 400 });

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await request.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isArchived,
      isFeatured,
    } = body;

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!name) return NextResponse.json("Name is required", { status: 400 });

    if (!price) return NextResponse.json("Price is required", { status: 400 });

    if (!categoryId)
      return NextResponse.json("Category ID is required", { status: 400 });

    if (!colorId)
      return NextResponse.json("Color ID is required", { status: 400 });

    if (!sizeId)
      return NextResponse.json("size ID is required", { status: 400 });

    if (!images || !images.length)
      return NextResponse.json("Atleast 1 image is required", { status: 400 });

    if (!params.productId)
      return NextResponse.json("Product ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isArchived,
        isFeatured,
      },
    });

    const product = await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });

    if (!params.productId)
      return NextResponse.json("Product ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return NextResponse.json("Unauthorized", { status: 403 });

    const product = await prisma.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
