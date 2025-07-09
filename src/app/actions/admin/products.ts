'use server';


import { NewProductFormState } from '@/app/admin/products/new/page';
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { productSchema } from "@/validations/productSchema"; // ✅ named import









function parseFormData(formData: FormData) {
  return {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    availabilityStatus: formData.get('availabilityStatus'),
    returnPolicy: formData.get('returnPolicy'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    brand: formData.get('brand'),
    sku: formData.get('sku'),
    weight: formData.get('weight'),
    warrantyInformation: formData.get('warrantyInformation'),
    shippingInformation: formData.get('shippingInformation'),
    minimumOrderQuantity: formData.get('minimumOrderQuantity'),
    tags: formData.getAll('tags'),
    dimensions: {
      width: formData.get('dimensions.width'),
      height: formData.get('dimensions.height'),
      depth: formData.get('dimensions.depth'),
    },
  };
}

export async function addNewProductAction(
  _: NewProductFormState,
  formData: FormData
): Promise<NewProductFormState> {
  console.log('🛠️ Receiving new product submission...');

  const rawData = parseFormData(formData);
  console.log("🔍 Parsed raw data:", rawData);

  const result = productSchema.safeParse(rawData);

  if (!result.success) {
    console.warn('❌ Validation failed:', result.error.format());
    return {
      success: false,
      message: 'Please correct the form input',
      inputs: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const validated = result.data;

  try {
    await addDoc(collection(db, "products"), {
      ...validated,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log("✅ Product added to Firestore:", validated);

    return {
      success: true,
      message: 'The product is created successfully',
    };
  } catch (error) {
    console.error("🔥 Firestore Error:", error);
    return {
      success: false,
      message: 'Failed to save product to database.',
      inputs: rawData,
    };
  }
}
