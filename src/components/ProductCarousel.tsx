'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export default function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                   bg-white dark:bg-gray-700 
                   text-gray-800 dark:text-gray-200 
                   p-2 shadow rounded-full 
                   hover:bg-gray-100 dark:hover:bg-gray-600
                   transition"
      >
        <ChevronLeft />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar py-6 px-10 scroll-smooth"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                   bg-white dark:bg-gray-700 
                   text-gray-800 dark:text-gray-200 
                   p-2 shadow rounded-full 
                   hover:bg-gray-100 dark:hover:bg-gray-600
                   transition"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
