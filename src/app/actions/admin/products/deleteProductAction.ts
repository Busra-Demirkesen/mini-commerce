"use server";

import { db } from "@/lib/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { del } from "@vercel/blob"; // Vercel Blob'dan görsel silmek için

export async function deleteProductAction(productId: string) {
  try {
    // Ürünü Firestore'dan silmeden önce görsel URL'sini al
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productData = productSnap.data();
      const imageUrl = productData.imageUrl;

      if (imageUrl) {
        try {
          // Vercel Blob URL'sinden dosya adını/yolunu çıkar
          const url = new URL(imageUrl);
          const pathname = url.pathname;
          // Vercel Blob'dan görseli sil
          await del(pathname);
          console.log("✅ Image deleted from Vercel Blob:", imageUrl);
        } catch (blobError) {
          console.error("🔥 Vercel Blob delete error:", blobError);
          // Görsel silme başarısız olsa bile ürün silme işlemine devam et
        }
      }
    }

    // Ürünü Firestore'dan sil
    await deleteDoc(doc(db, "products", productId));
    console.log("✅ Product deleted from Firestore:", productId);
    return { success: true };
  } catch (error) {
    console.error("🔥 Delete error:", error);
    return { success: false, message: "Failed to delete product" };
  }
}
