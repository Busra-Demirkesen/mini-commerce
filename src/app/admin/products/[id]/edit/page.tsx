"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Product,
  Category,
  AvailabilityStatus,
  ReturnPolicy,
  Tag,
} from "@/types/product";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import CheckboxGroup from "@/components/shared/CheckboxGroup";
import DimensionFields from "@/components/shared/DimensionFields";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "@/validations/productSchema";
import { z } from "zod";
import { updateProductAction } from "@/app/actions/admin/products"; // updateProductAction eklendi
import Image from "next/image"; // Image bileşeni eklendi

type EditProductForm = z.infer<typeof editProductSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditProductForm>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      title: "",
      description: "",
      category: Category.BEAUTY,
      availabilityStatus: AvailabilityStatus.IN_STOCK,
      returnPolicy: ReturnPolicy.NO_RETURN,
      price: 0,
      stock: 0,
      brand: "",
      sku: "",
      weight: 0,
      warrantyInformation: "",
      shippingInformation: "",
      minimumOrderQuantity: 1,
      tags: [],
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
      },
      image: undefined,
      images: [],
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Product;

          setValue("title", data.title ?? "");
          setValue("description", data.description ?? "");
          setValue("category", data.category ?? Category.BEAUTY);
          setValue("availabilityStatus", data.availabilityStatus ?? AvailabilityStatus.IN_STOCK);
          setValue("returnPolicy", data.returnPolicy ?? ReturnPolicy.NO_RETURN);
          setValue("price", data.price ?? 0);
          setValue("stock", data.stock ?? 0);
          setValue("brand", data.brand ?? "");
          setValue("sku", data.sku ?? "");
          setValue("weight", data.weight ?? 0);
          setValue("warrantyInformation", data.warrantyInformation ?? "");
          setValue("shippingInformation", data.shippingInformation ?? "");
          setValue("minimumOrderQuantity", data.minimumOrderQuantity ?? 1);
          setValue("tags", data.tags || []);
          setValue("dimensions", data.dimensions || { width: 0, height: 0, depth: 0 });
          // Mevcut görseli önizlemek için ayarla
          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    if (errors.image) {
      setImagePreview(null);
    }
  }, [errors.image]);

  const onSubmit = async (data: EditProductForm) => {
    const formData = new FormData();

    formData.append("id", id as string);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("availabilityStatus", data.availabilityStatus);
    formData.append("returnPolicy", data.returnPolicy);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("brand", data.brand);
    formData.append("sku", data.sku);
    formData.append("weight", data.weight.toString());
    formData.append("warrantyInformation", data.warrantyInformation);
    formData.append("shippingInformation", data.shippingInformation);
    formData.append(
      "minimumOrderQuantity",
      data.minimumOrderQuantity.toString()
    );

    data.tags?.forEach((tag) => formData.append("tags", tag));

    formData.append("dimensions.width", data.dimensions.width.toString());
    formData.append("dimensions.height", data.dimensions.height.toString());
    formData.append("dimensions.depth", data.dimensions.depth.toString());

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    } else if (imagePreview) {
      // No new image selected, but there's an existing one
      formData.append("imageUrl", imagePreview);
    }

    const emptyState = {
      success: false,
      message: "",
      inputs: {},
      errors: {},
    };

    try {
      const result = await updateProductAction(emptyState, formData);

      if (result.success) {
        alert("Product updated successfully ✅");
        setImagePreview(null);
        router.push("/admin"); // Redirect to admin panel after successful update
      } else {
        console.error("Backend validation error for update:", result.errors);
        alert("Failed to update product: " + result.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (loading) return <p className="text-gray-300">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto py-10 px-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
        <InputField label="Title" {...register("title")} error={errors.title?.message} />
        <InputField label="Description" {...register("description")} error={errors.description?.message} />
        <SelectField label="Category" options={Object.values(Category)} {...register("category")} error={errors.category?.message} />
        <InputField label="Price" type="number" {...register("price")} error={errors.price?.message} />
        <InputField label="Stock" type="number" {...register("stock")} error={errors.stock?.message} />
        <InputField label="Brand" {...register("brand")} error={errors.brand?.message} />
        <InputField label="SKU" {...register("sku")} error={errors.sku?.message} />
        <InputField label="Weight" type="number" {...register("weight")} error={errors.weight?.message} />
        <InputField label="Warranty Information" {...register("warrantyInformation")} error={errors.warrantyInformation?.message} />
        <InputField label="Shipping Information" {...register("shippingInformation")}
          error={errors.shippingInformation?.message} />
        <InputField label="Minimum Order Quantity" type="number" {...register("minimumOrderQuantity")}
          error={errors.minimumOrderQuantity?.message} />

        {/* Yeni Eklenen Görsel Input Alanı */}
        <div className="flex flex-col">
          <label htmlFor="image" className="text-gray-100 mb-2">Product Image</label>
          <input
            type="file"
            accept=".jpeg, .jpg, .webp, .png"
            {...register("image")}
            onChange={(e) => {
              handleImageChange(e);
              register("image").onChange(e);
            }}
            className="dark:bg-stone-200 dark:text-stone-900 p-2 rounded"
          />
          {imagePreview && (
            <div className="mt-4 w-auto h-auto max-w-sm max-h-sm relative">
              <Image
                src={imagePreview}
                alt="Product Preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md shadow-md"
              />
            </div>
          )}
          {errors.image && (
            <p className="text-red-500 text-sm">
              {errors.image.message as string}
            </p>
          )}
        </div>

        <CheckboxGroup
          label="Tags"
          name="tags"
          options={Object.values(Tag)}
          register={register}
          error={errors.tags?.[0]?.message}
        />

        <SelectField label="Availability Status" options={Object.values(AvailabilityStatus)} {...register("availabilityStatus")} error={errors.availabilityStatus?.message} />
        <SelectField label="Return Policy" options={Object.values(ReturnPolicy)} {...register("returnPolicy")} error={errors.returnPolicy?.message} />

        <DimensionFields register={register} errors={errors.dimensions} />

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-white transition">
            Update Product
          </button>
        </div>
      </form>
    </main>
  );
}
