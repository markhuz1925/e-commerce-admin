import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import ColorsClient from "./components/colors-client";
import { ColorsColumn } from "./components/columns";

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorsColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
}
