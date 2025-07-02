"use server";

import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteProductAction(productId: string) {
  try {
    await deleteDoc(doc(db, "products", productId));
    console.log("✅ Product deleted:", productId);
    return { success: true };
  } catch (error) {
    console.error("🔥 Delete error:", error);
    return { success: false, message: "Failed to delete product" };
  }
}
