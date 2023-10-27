import prisma from "@/prisma/client";

export async function getStockCount(storeId: string) {
  const stockCount = await prisma.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return stockCount;
}
