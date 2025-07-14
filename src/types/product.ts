import { z } from "zod";
import { productSchema } from "@/validations/productSchema";

export type ProductForm = z.infer<typeof productSchema>;

// ✅ Eğer edit için partial schema kullanıyorsan ekle:
export type ProductFormEdit = Partial<ProductForm>;

// ✅ Dimensions spelling fix
export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: Category;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  tags?: Tag[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: AvailabilityStatus;
  reviews?: Review[];
  returnPolicy: ReturnPolicy;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
  imageUrl?: string; // ✅ Eklendi: Firestore'a kaydedilen görsel URL'si
}

export enum Tag {
  VEGAN = 'vegan',
  ORGANIC = 'organic',
  BESTSELLER = 'bestseller',
  NEW = 'new',
  LIMITED = 'limited',
}

export enum Category {
  FRAGRANCES = 'fragrances',
  BEAUTY = 'beauty',
  GROCERIES = 'groceries',
}

export const allCategories = Object.values(Category);

export enum AvailabilityStatus {
  IN_STOCK = 'In Stock',
  OUT_OF_STOCK = 'Out of Stock',
}

export enum ReturnPolicy {
  NO_RETURN = 'No return policy',
  DAYS_14 = '14 days return policy',
  DAYS_7 = '7 days return policy',
  DAYS_30 = '30 days return policy',
  DAYS_60 = '60 days return policy',
  DAYS_90 = '90 days return policy',
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}
