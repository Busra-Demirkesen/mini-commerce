'use server';

import { NewProductFormState } from '@/app/admin/products/new/page';
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore"; // getDoc ve updateDoc eklendi
import { put, del } from "@vercel/blob"; // del eklendi
import { productSchema } from "@/validations/productSchema";

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
    console.warn('Full Zod error object:', result.error);

    const errors = result.error.flatten().fieldErrors;
    const formErrors = result.error.flatten().formErrors;

    // Eğer alan bazlı hata yoksa ama form hatası varsa, bunu da ekleyelim
    if (Object.keys(errors).length === 0 && formErrors.length > 0) {
        // formErrors'u inputs ile ilişkilendirmek için bir yol bulmamız gerekebilir
        // Şimdilik, genel bir hata mesajı olarak ekleyelim
        return {
            success: false,
            message: formErrors[0] || 'Please correct the form input',
            inputs: rawData,
            errors: { general: formErrors }, // Genel hataları 'general' altına ekle
        };
    }

    return {
      success: false,
      message: 'Please correct the form input',
      inputs: rawData,
      errors: errors,
    };
  }

  const validated = result.data;
  console.log("✅ Validation successful, proceeding with data:", validated);

  // ✅ Image upload işlemleri
  let imageUrl = "";
  const MAX_ALLOWED_IMAGE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB
  const allowedImageTypes = [".jpeg", ".jpg", ".webp", ".png"];

  const image = formData.get("image") as File | null;

  console.log("🖼️ Image file from FormData:", image);

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
      console.warn(
        "❌ Image size exceeds limit:",
        image.size,
        "bytes (max",
        MAX_ALLOWED_IMAGE_SIZE,
        "bytes)"
      );
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
      console.log("⬆️ Attempting to upload image to Vercel Blob...");
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
    console.log("💾 Attempting to save product to Firestore...");
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

export async function updateProductAction(
  _: NewProductFormState,
  formData: FormData
): Promise<NewProductFormState> {
  console.log('🛠️ Receiving product update submission...');

  const rawData = parseFormData(formData);
  const productId = formData.get('id') as string;
  console.log("🔍 Parsed raw data for update:", rawData);
  console.log("🔍 Product ID for update:", productId);


  const result = productSchema.safeParse(rawData);

  if (!result.success) {
    console.warn('❌ Validation failed for update:', result.error.format());
    console.warn('Full Zod error object for update:', result.error);
    return {
      success: false,
      message: 'Please correct the form input',
      inputs: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const validated = result.data;
  console.log("✅ Validation successful for update, proceeding with data:", validated);

  let imageUrl = validated.imageUrl || ""; // Mevcut veya yeni görsel URL'si
  const MAX_ALLOWED_IMAGE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB
  const allowedImageTypes = [".jpeg", ".jpg", ".webp", ".png"];

  const imageFile = formData.get("image") as File | null;

  // Mevcut ürünü Firestore'dan alarak eski görsel URL'sini kontrol et
  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);
  const existingProduct = productSnap.data();

  if (imageFile && imageFile.size > 0) {
    const isAllowedType = allowedImageTypes.some((type) =>
      imageFile.name.toLowerCase().endsWith(type)
    );

    if (!isAllowedType) {
      return {
        success: false,
        message: "Please update product image.",
        inputs: { ...rawData },
        errors: {
          images: ["Allowed image formats: .jpeg, .jpg, .webp, .png."],
        },
      };
    }

    if (imageFile.size > MAX_ALLOWED_IMAGE_SIZE) {
      console.warn(
        "❌ Image size exceeds limit:",
        imageFile.size,
        "bytes (max",
        MAX_ALLOWED_IMAGE_SIZE,
        "bytes)"
      );
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
      // Eski görseli sil
      if (existingProduct?.imageUrl) {
        console.log("🗑️ Deleting old image from Vercel Blob:", existingProduct.imageUrl);
        await del(existingProduct.imageUrl);
      }

      // Yeni görseli yükle
      console.log("⬆️ Attempting to upload new image to Vercel Blob...");
      const extension = imageFile.type.split("/")[1];
      const imageName = `products/${Date.now()}.${extension}`;

      const blob = await put(imageName, imageFile, {
        access: "public",
        token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      });

      imageUrl = blob.url;
      console.log("✅ New image uploaded to Vercel Blob:", imageUrl);
    } catch (error) {
      console.error("🔥 Vercel Blob upload error:", error);
      return {
        success: false,
        message: "Failed to upload new product image.",
        inputs: { ...rawData },
      };
    }
  } else if (existingProduct?.imageUrl) {
    // Yeni görsel yoksa ve eski görsel varsa, eski görsel URL'sini koru
    imageUrl = existingProduct.imageUrl;
  }

  try {
    console.log("💾 Attempting to update product in Firestore...");
    await updateDoc(productRef, {
      ...validated,
      imageUrl,
      updatedAt: Timestamp.now(),
    });
    console.log("✅ Product updated in Firestore:", validated);

    return {
      success: true,
      message: 'The product is updated successfully',
    };
  } catch (error) {
    console.error("🔥 Firestore Error:", error);
    return {
      success: false,
      message: 'Failed to update product in database.',
      inputs: rawData,
    };
  }
}

export async function deleteProductAction(
  productId: string
): Promise<NewProductFormState> {
  console.log('🛠️ Receiving product deletion request...');

  if (!productId) {
    console.warn('❌ Product ID is missing for deletion.');
    return {
      success: false,
      message: 'Product ID is required for deletion.',
    };
  }

  try {
    // Firestore'dan ürünü alarak görsel URL'sini bul
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productData = productSnap.data();

      // Vercel Blob'dan görseli sil
      if (productData.imageUrl) {
        console.log("🗑️ Deleting image from Vercel Blob:", productData.imageUrl);
        await del(productData.imageUrl);
      }

      // Firestore'dan ürünü sil
      await deleteDoc(productRef);
      console.log("✅ Product deleted from Firestore:", productId);

      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } else {
      console.warn('❌ Product not found for deletion:', productId);
      return {
        success: false,
        message: 'Product not found.',
      };
    }
  } catch (error) {
    console.error("🔥 Deletion Error:", error);
    return {
      success: false,
      message: 'Failed to delete product.',
    };
  }
}
