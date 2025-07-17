"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { deleteProductAction } from "@/app/actions/admin/products";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function AdminPanelPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null); // ✅ Silinecek ürün ID'si artık string

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const q = query(productsCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = (productId: string) => {
    setShowConfirm(productId);
  };

  const confirmDelete = async () => {
    if (showConfirm === null) return;

    const result = await deleteProductAction(showConfirm);

    if (result.success) {
      setProducts(products.filter((p) => p.id !== showConfirm));
      setMessage({ text: "Product deleted ✅", type: "success" });
    } else {
      setMessage({ text: "Failed to delete product", type: "error" });
    }

    setShowConfirm(null);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <main className="max-w-5xl mx-auto py-10 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Product Management</h1>
        <Link
          href="/admin/products/new"
          className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Add New Product
        </Link>
      </div>

      {message && (
        <div
          className={`mb-6 p-3 rounded-md text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-300 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Product Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Image</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Category</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Price</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Stock</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        width={50}
                        height={50}
                        className="object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.category}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.price} TL</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.stock}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.availabilityStatus}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Are you sure you want to delete this product?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
