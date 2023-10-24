import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { SizesColumn } from "./components/columns";
import SizesClient from "./components/sizes-client";

export default async function SizesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizesColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
}
