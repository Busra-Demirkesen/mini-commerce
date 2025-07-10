'use server';

import { NewProductFormState } from '@/app/admin/products/new/page';
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { productSchema } from "@/validations/productSchema";
import { put } from "@vercel/blob";

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

  // ✅ Image upload işlemleri
  let imageUrl = "";
  const MAX_ALLOWED_IMAGE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB
  const allowedImageTypes = [".jpeg", ".jpg", ".webp"];

  const image = formData.get("image") as File | null;

  if (image && image.size > 0) {
    const isAllowedType = allowedImageTypes.some((type) =>
      image.name.toLowerCase().endsWith(type)
    );

    if (!isAllowedType) {
      return {
        success: false,
        message: "Please update product image.",
        inputs: { ...rawData },
        errors: {
          images: ["Allowed image formats: .jpeg, .jpg, .webp."],
        },
      };
    }

    if (image.size > MAX_ALLOWED_IMAGE_SIZE) {
      return {
        success: false,
        message: "Please update product image, maximum allowed size is 4.5 MB.",
        inputs: { ...rawData },
        errors: {
          images: ["Maximum allowed size is 4.5 MB."],
        },
      };
    }

    try {
      // ✅ Dosya adı oluşturma (timestamp ile benzersiz)
      const extension = image.type.split("/")[1];
      const imageName = `products/${Date.now()}.${extension}`;

      const blob = await put(imageName, image, {
        access: "public",
        token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      });

      imageUrl = blob.url;
      console.log("✅ Image uploaded to Vercel Blob:", imageUrl);
    } catch (error) {
      console.error("🔥 Vercel Blob upload error:", error);
      return {
        success: false,
        message: "Failed to upload product image.",
        inputs: { ...rawData },
      };
    }
  }

  // ✅ Firestore kaydı
  try {
    await addDoc(collection(db, "products"), {
      ...validated,
      imageUrl, // ✅ Image URL Firestore’a kaydedildi
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
