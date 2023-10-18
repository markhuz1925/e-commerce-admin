import prisma from "@/prisma/client";

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div>{store?.name}</div>;
}
