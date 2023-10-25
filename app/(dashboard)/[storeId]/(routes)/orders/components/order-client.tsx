"use client";

import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";

export default function OrderClient({ data }: { data: OrderColumn[] }) {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <Separator orientation="horizontal" />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
}
