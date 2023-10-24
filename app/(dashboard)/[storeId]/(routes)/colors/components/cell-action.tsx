"use client";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import {
  CopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ColorsColumn } from "./columns";

export default function CellAction({ data }: { data: ColorsColumn }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Color Id copied to the clipboard.");
  };

  const deleteColor = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
      router.refresh();
      toast.success("Color successfully deleted");
    } catch (error) {
      toast.error("Make sure you removed all products using this color first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteColor}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyId(data.id)}>
            <CopyIcon className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-500"
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
