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

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        isArchived,
        isFeatured,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId)
      return NextResponse.json("Store ID is required", { status: 400 });

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
