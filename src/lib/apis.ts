
export async function getProductById(id: number) {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error('Failed to fetch product', err);
    return null;
  }
}


export async function getProductsByCategory(category: string) {
  const res = await fetch(`https://dummyjson.com/products/category/${category}`);
  const data = await res.json();
  return data.products;
}