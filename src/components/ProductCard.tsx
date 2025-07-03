import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string | number;
  title: string;
  price: number;
  thumbnail: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} passHref>
      <div className="min-w-[200px] rounded-xl shadow hover:shadow-lg transition p-4 bg-white cursor-pointer">
        <Image
          src={product.thumbnail || "/fallback.jpg"}
          alt={product.title}
          width={200}
          height={200}
          className="rounded-md mb-2 w-full h-48 object-cover"
        />

        <h2 className="text-sm font-medium truncate">{product.title}</h2>
        <p className="text-sm text-gray-500">${product.price}</p>
      </div>
    </Link>
  );
}
