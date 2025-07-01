import { getProductsByCategory } from '@/lib/apis';

import ProductCarousel from '@/components/ProductCarousel';

export default async function HomePage() {
  const smartphones = await getProductsByCategory('smartphones');
  const laptops = await getProductsByCategory('laptops');
  const fragrances = await getProductsByCategory('fragrances');

  return (
    <main className="py-10 space-y-12">
      <section>
        <h2 className="text-xl font-semibold px-10">Smartphones</h2>
        <ProductCarousel products={smartphones} />
      </section>

      <section>
        <h2 className="text-xl font-semibold px-10">Laptops</h2>
        <ProductCarousel products={laptops} />
      </section>

      <section>
        <h2 className="text-xl font-semibold px-10">Fragrances</h2>
        <ProductCarousel products={fragrances} />
      </section>
    </main>
  );
}
