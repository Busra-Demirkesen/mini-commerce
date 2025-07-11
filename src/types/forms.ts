import { z } from "zod";
import { productSchema, editProductSchema } from "@/validations/productSchema";

export type ProductForm = z.infer<typeof editProductSchema>;
export type FullProductForm = z.infer<typeof productSchema>;
