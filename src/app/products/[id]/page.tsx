"use client";

import { useCart } from "@/context/CartContext";
import { getProductById } from "@/lib/apis";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Product, Category } from "@/types/product";

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      getProductById(id).then(setProduct);
    }
  }, [id]);

  if (!product)
    return (
      <p className="p-10 text-gray-500 dark:text-gray-300">
        Product not found.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-xl w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            {product.category}
          </p>
          <h1 className="text-2xl font-semibold text-gray-100">
            {product.title}
          </h1>
          <p className="text-gray-200 text-sm">
            {product.description}
          </p>
          <p className="text-sm text-gray-400">50ml</p>
          <p className="text-base font-bold text-gray-100">
            ${product.price}
          </p>
          <button
            className="mt-6 px-5 py-2 rounded-md bg-gray-100 text-gray-900 text-sm hover:bg-white transition"
            onClick={() =>
              addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.imageUrl,
                quantity: 1,
              })
            }
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
