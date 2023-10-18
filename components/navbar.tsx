import MainNav from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import prisma from "@/prisma/client";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border border-b">
      <div className="flex items-center px-4 h-16">
        <StoreSwitcher store={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
