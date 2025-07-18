import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getProductById(id: string) {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error('Failed to fetch product by ID', err);
    return null;
  }
}

export async function getProductsByCategory(category: string) {
  try {
    const productsCollectionRef = collection(db, "products");
    const q = query(productsCollectionRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const productsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
      };
    });
    return productsData;
  } catch (err) {
    console.error('Failed to fetch products by category', err);
    return [];
  }
}