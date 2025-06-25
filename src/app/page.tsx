// app/page.tsx
import { getAllProducts } from '@/lib/apis';
import ProductCarousel from '@/components/ProductCarousel';

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <section className="py-10">
      <ProductCarousel products={products} />
    </section>
  );
}
