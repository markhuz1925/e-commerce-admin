import prisma from "@/prisma/client";
import ColorForm from "./components/color-form";

export default async function ColorPage({
  params,
}: {
  params: { colorId: string };
}) {
  const color = await prisma.color.findFirst({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <ColorForm color={color} />
      </div>
    </div>
  );
}
