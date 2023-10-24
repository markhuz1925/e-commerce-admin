"use client";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { colorFormSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type colorFormValues = z.infer<typeof colorFormSchema>;

export default function ColorForm({ color }: { color: Color | null }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = color ? "Edit Color" : "Add Color";
  const description = color ? "Edit your color" : "Add a new color";
  const toastMessage = color
    ? "Color successfully updated"
    : "Color successfully created";
  const action = color ? "Update" : "Create";

  const form = useForm<colorFormValues>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: color || {
      name: "",
      value: "",
    },
  });

  const submitForm = async (values: colorFormValues) => {
    try {
      setLoading(true);
      if (color) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteColor = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {color && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash2Icon size={18} />
          </Button>
        )}
      </div>
      <Separator orientation="horizontal" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
