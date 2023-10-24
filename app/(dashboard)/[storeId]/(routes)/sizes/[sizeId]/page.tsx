import prisma from "@/prisma/client";
import SizeForm from "./components/size-form";

export default async function SizePage({
  params,
}: {
  params: { sizeId: string };
}) {
  const size = await prisma.size.findFirst({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <SizeForm size={size} />
      </div>
    </div>
  );
}
