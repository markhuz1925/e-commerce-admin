import prisma from "@/prisma/client";
import ProductForm from "./components/product-form";

export default async function ProductPage({
  params,
}: {
  params: { productId: string; storeId: string };
}) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          product={product}
        />
      </div>
    </div>
  );
}
