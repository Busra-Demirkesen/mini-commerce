import { z } from "zod";
import { editProductSchema } from "@/validations/productSchema";

export type EditProductForm = z.infer<typeof editProductSchema>;

