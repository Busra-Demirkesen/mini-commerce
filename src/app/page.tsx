import { getProductsByCategory } from '@/lib/apis';

import ProductCarousel from '@/components/ProductCarousel';
import { Category } from '@/types/product'; // Category enum'ını import ettim

export default async function HomePage() {
  const smartphones = await getProductsByCategory(Category.SMARTPHONES);
  const laptops = await getProductsByCategory(Category.LAPTOPS);
  const accessories = await getProductsByCategory(Category.TECHNOLOGICAL_ACCESSORIES);

  return (
    <main className="py-10 space-y-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">



      <section>
        <h2 className="text-xl font-semibold px-10 text-gray-900 dark:text-gray-100">Smartphones</h2>
        <ProductCarousel products={smartphones} />
      </section>

      <section>
        <h2 className="text-xl font-semibold px-10 text-gray-900 dark:text-gray-100">Laptops</h2>
        <ProductCarousel products={laptops} />
      </section>

      <section>
        <h2 className="text-xl font-semibold px-10 text-gray-900 dark:text-gray-100">Technological Accessories</h2>
        <ProductCarousel products={accessories} />
      </section>
    </main>
  );
}
