import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import BillboardClient from "./components/billboard-client";

export default function BillboardsPage() {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <BillboardClient />
      </div>
    </div>
  );
}
