import { z } from "zod";
import { Category, AvailabilityStatus, ReturnPolicy, Tag } from "@/types/product";

export const productSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or less")
    .trim(),

  description: z.string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description must be 1000 characters or less")
    .trim(),

  category: z.nativeEnum(Category),
  availabilityStatus: z.nativeEnum(AvailabilityStatus),
  returnPolicy: z.nativeEnum(ReturnPolicy),

  price: z.coerce.number()
    .min(0, "Price must be at least 0"),

  stock: z.coerce.number()
    .min(0, "Stock must be at least 0"),

  brand: z.string()
    .min(1, "Brand is required")
    .max(100, "Brand must be 100 characters or less")
    .trim(),

  sku: z.string()
    .min(1, "SKU is required")
    .max(100, "SKU must be 100 characters or less")
    .trim(),

  weight: z.coerce.number()
    .min(0, "Weight must be at least 0"),

  warrantyInformation: z.string()
    .min(1, "Warranty information is required")
    .max(1000, "Warranty information must be 1000 characters or less")
    .trim(),

  shippingInformation: z.string()
    .min(1, "Shipping information is required")
    .max(1000, "Shipping information must be 1000 characters or less")
    .trim(),

  minimumOrderQuantity: z.coerce.number()
    .min(1, "Minimum order quantity must be at least 1"),

  tags: z.array(z.nativeEnum(Tag))
    .min(1, "At least one tag is required")
    .max(10, "You can select up to 10 tags"),

  dimensions: z.object({
    width: z.coerce.number()
      .min(0, "Width must be at least 0"),

    height: z.coerce.number()
      .min(0, "Height must be at least 0"),

    depth: z.coerce.number()
      .min(0, "Depth must be at least 0"),
  }),

  image: z.any().optional(),



});

// validations/productSchema.ts
export const editProductSchema = productSchema;

console.log("✅ Category:", Category);
console.log("✅ AvailabilityStatus:", AvailabilityStatus);
console.log("✅ ReturnPolicy:", ReturnPolicy);
console.log("✅ Tag:", Tag);
