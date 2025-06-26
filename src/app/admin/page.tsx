
'use client';

import Link from 'next/link';

export default function AdminPanelPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">🛠️ Admin Panel</h1>

      <div className="grid gap-6">
        <Link
          href="/admin/products/new"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition text-center"
        >
          ➕ Yeni Ürün Ekle
        </Link>

        <Link
          href="/admin/products"
          className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition text-center"
        >
          📦 Ürünleri Görüntüle
        </Link>
      </div>
    </main>
  );
}
