"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { deleteProductAction } from "@/app/actions/admin/products/deleteProductAction";

export default function AdminPanelPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const result = await deleteProductAction(productId);
    if (result.success) {
      alert("Product deleted ✅");
      setProducts(products.filter((p) => p.id !== productId));
    } else {
      alert("Failed to delete product");
    }
  };

  return (
    <main className="max-w-5xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Product Management
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-neutral-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90"
        >
          Add New Product
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-neutral-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-700">Product Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-700">Category</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-700">Price</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-700">Stock</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 text-sm text-neutral-900">{product.title}</td>
                  <td className="px-4 py-2 text-sm text-neutral-900">{product.category}</td>
                  <td className="px-4 py-2 text-sm text-neutral-900">{product.price} TL</td>
                  <td className="px-4 py-2 text-sm text-neutral-900">{product.stock}</td>
                  <td className="px-4 py-2 text-sm text-neutral-900">{product.availabilityStatus}</td>
                  <td className="px-4 py-2 text-sm text-neutral-900 flex items-center space-x-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <PencilSquareIcon className="h-5 w-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
                    </Link>
                    <button onClick={() => handleDelete(product.id)}>
                      <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
