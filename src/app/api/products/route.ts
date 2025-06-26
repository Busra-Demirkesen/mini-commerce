// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { Product } from "@/types/product";

// Sahte veri (gerçek veritabanı yerine geçici olarak kullanıyoruz)
const mockProducts: Product[] = [
  {
    title: "Kol Saati",
    description: "Şık ve sade tasarımıyla günlük kullanıma uygun kol saati.",
    category: "Accessories",
    availabilityStatus: "InStock",
    returnPolicy: "ExchangeOnly",
    price: 129.99,
    stock: 10,
    tags: ["New", "Featured"],
    dimensions: { width: 4, height: 1, depth: 0.5 },
  },
  {
    title: "Akıllı Saat",
    description: "Spor ve sağlık takibi için ideal çok amaçlı akıllı saat.",
    category: "Electronics",
    availabilityStatus: "InStock",
    returnPolicy: "Returnable",
    price: 399.99,
    stock: 5,
    tags: ["Bestseller"],
    dimensions: { width: 4.2, height: 1.2, depth: 0.6 },
  },
];

export async function GET() {
  return NextResponse.json(mockProducts);
}
