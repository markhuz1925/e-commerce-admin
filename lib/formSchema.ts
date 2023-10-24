import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const billboardFormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

export const sizeFormSchema = z.object({
  value: z.string().min(1),
  name: z.string().min(1),
});

export const colorFormSchema = z.object({
  value: z.string().min(1),
  name: z.string().min(1),
});
