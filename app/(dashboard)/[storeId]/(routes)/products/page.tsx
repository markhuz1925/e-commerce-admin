import { formatter } from "@/lib/utils";
import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { ProductColumn } from "./components/columns";
import ProductClient from "./components/product-client";

export default async function ProductsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const products = await prisma.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}
