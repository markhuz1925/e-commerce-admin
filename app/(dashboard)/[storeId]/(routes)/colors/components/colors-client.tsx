"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorsColumn, columns } from "./columns";

export default function ColorsClient({ data }: { data: ColorsColumn[] }) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator orientation="horizontal" />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
}
