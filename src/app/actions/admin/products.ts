'use server';

import { NewProductFormState } from '@/app/admin/products/new/page';
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, doc, updateDoc, getDoc } from "firebase/firestore"; // getDoc ve updateDoc eklendi
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
    return {
      success: false,
      message: 'Please correct the form input',
      inputs: rawData,
      errors: result.error.flatten().fieldErrors,
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
  let currentImageUrl = "";

  if (productSnap.exists()) {
    currentImageUrl = productSnap.data().imageUrl || "";
  }

  console.log("🖼️ Image file for update from FormData:", imageFile);
  console.log("Current image URL:", currentImageUrl);

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
        "❌ Image size exceeds limit for update:",
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
      console.log("⬆️ Attempting to upload new image to Vercel Blob for update...");
      const extension = imageFile.type.split("/")[1];
      const imageName = `products/${Date.now()}.${extension}`;

      const blob = await put(imageName, imageFile, {
        access: "public",
        token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
      });

      imageUrl = blob.url;
      console.log("✅ New image uploaded to Vercel Blob:", imageUrl);

      // Eski görseli sil (eğer varsa)
      if (currentImageUrl) {
        try {
          const oldUrl = new URL(currentImageUrl);
          const oldPathname = oldUrl.pathname;
          await del(oldPathname);
          console.log("🗑️ Old image deleted from Vercel Blob:", currentImageUrl);
        } catch (delError) {
          console.warn("⚠️ Failed to delete old image from Vercel Blob:", delError);
          // Hata olsa bile güncelleme işlemine devam et
        }
      }
    } catch (error) {
      console.error("🔥 Vercel Blob upload error for update:", error);
      return {
        success: false,
        message: "Failed to upload product image.",
        inputs: { ...rawData },
      };
    }
  } else if (validated.imageUrl === null || validated.imageUrl === undefined) {
    // Eğer görsel alanı boş gönderildiyse ve mevcut bir görsel varsa, sil
    if (currentImageUrl) {
        try {
            const oldUrl = new URL(currentImageUrl);
            const oldPathname = oldUrl.pathname;
            await del(oldPathname);
            console.log("🗑️ Existing image removed (user cleared it) from Vercel Blob:", currentImageUrl);
            imageUrl = ""; // URL'yi boşalt
        } catch (delError) {
            console.warn("⚠️ Failed to delete existing image (user cleared it) from Vercel Blob:", delError);
            imageUrl = currentImageUrl; // Hata durumunda URL'yi koru
        }
    }
  } else if (imageFile === null && currentImageUrl) {
    // Görsel değişmediyse ve mevcut bir görsel varsa, mevcut URL'yi koru
    imageUrl = currentImageUrl;
  } else {
    imageUrl = ""; // Görsel yoksa veya silindiyse boş bırak
  }

  // ✅ Firestore kaydını güncelle
  try {
    console.log("💾 Attempting to update product in Firestore...");
    const updateData: Record<string, any> = {
      ...validated,
      imageUrl: imageUrl, // Güncel görsel URL'si
      updatedAt: Timestamp.now(),
    };

    // `image` field'ı formData'dan geliyorsa, Firestore'a kaydetme
    delete updateData.image; // productSchema'dan gelen 'image' alanını kaldır

    await updateDoc(productRef, updateData);
    console.log("✅ Product updated in Firestore:", validated);

    return {
      success: true,
      message: 'The product is updated successfully',
    };
  } catch (error) {
    console.error("🔥 Firestore Update Error:", error);
    return {
      success: false,
      message: 'Failed to update product to database.',
      inputs: rawData,
    };
  }
}
