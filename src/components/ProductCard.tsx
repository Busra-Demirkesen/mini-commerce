import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} passHref>
      <div className="min-w-[200px] rounded-xl shadow hover:shadow-lg transition p-4 bg-gray-100 dark:bg-gray-800 cursor-pointer">
        <div className="relative w-full h-48 overflow-hidden rounded-md mb-2">
          <Image
            src={product.imageUrl || "/fallback.jpg"}
            alt={product.title}
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
        </div>

        <h2 className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
          {product.title}
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          ${product.price}
        </p>
      </div>
    </Link>
  );
}
