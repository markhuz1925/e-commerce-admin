import { UserButton } from "@clerk/nextjs";
import MainNav from "@/components/main-nav";

export default function Navbar() {
  return (
    <div className="border border-b">
      <div className="flex items-center px-4 h-16">
        <div>This will be a store switcher</div>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
