import { NextResponse } from "next/server";

export async function GET() {
  const mockProducts = [
    {
      id: "1",
      title: "Minimal Kol Saati",
      description: "Şık ve modern minimal kol saati. Metal kasa, deri kayış, su geçirmez tasarım.",
      category: "ACCESSORIES",
      availabilityStatus: "IN_STOCK",
      returnPolicy: "RETURNABLE",
      price: 599.99,
      stock: 12,
      tags: ["NEW_ARRIVAL"],
      dimensions: {
        width: 4,
        height: 1,
        depth: 0.5,
      },
    },
    {
      id: "2",
      title: "Dekoratif Masa Lambası",
      description: "Sade ve şık tasarımlı dekoratif masa lambası. Yumuşak ışık, metal ayak.",
      category: "HOME_DECOR",
      availabilityStatus: "OUT_OF_STOCK",
      returnPolicy: "NON_RETURNABLE",
      price: 299.99,
      stock: 0,
      tags: ["SALE"],
      dimensions: {
        width: 10,
        height: 25,
        depth: 10,
      },
    },
  ];

  return NextResponse.json(mockProducts);
}
