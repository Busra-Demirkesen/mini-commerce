"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Category, AvailabilityStatus, ReturnPolicy, Tag } from "@/types/product";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import CheckboxGroup from "@/components/shared/CheckboxGroup";
import DimensionFields from "@/components/shared/DimensionFields";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "@/validations/productSchema";

// ✅ TypeScript form type
type ProductForm = z.infer<typeof editProductSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // ✅ useForm with editProductSchema
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      tags: [],
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
      },
    },
  });

  // ✅ Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Product;

          // ✅ Populate form values
          setValue("title", data.title);
          setValue("description", data.description);
          setValue("category", data.category);
          setValue("price", data.price);
          setValue("stock", data.stock);
          setValue("availabilityStatus", data.availabilityStatus);
          setValue("returnPolicy", data.returnPolicy);
          setValue("tags", data.tags || []);
          setValue("dimensions", data.dimensions);
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

  // ✅ Submit handler
  const onSubmit = async (data: ProductForm) => {
    try {
      const docRef = doc(db, "products", id as string);
      await updateDoc(docRef, data);
      alert("Product updated successfully ✅");
      router.push("/admin/products");
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
        <InputField
          label="Title"
          {...register("title")}
          error={errors.title?.message}
        />
        <InputField
          label="Description"
          {...register("description")}
          error={errors.description?.message}
        />
        <SelectField
          label="Category"
          options={Object.values(Category)}
          {...register("category")}
          error={errors.category?.message}
        />
        <InputField
          label="Price"
          type="number"
          {...register("price")}
          error={errors.price?.message}
        />
        <InputField
          label="Stock"
          type="number"
          {...register("stock")}
          error={errors.stock?.message}
        />
        <CheckboxGroup
          label="Tags"
          name="tags"
          options={Object.values(Tag)}
          register={register}
          error={errors.tags?.message || errors.tags?.[0]?.message}
        />
        <SelectField
          label="Availability Status"
          options={Object.values(AvailabilityStatus)}
          {...register("availabilityStatus")}
          error={errors.availabilityStatus?.message}
        />
        <SelectField
          label="Return Policy"
          options={Object.values(ReturnPolicy)}
          {...register("returnPolicy")}
          error={errors.returnPolicy?.message}
        />
        <DimensionFields register={register} errors={errors.dimensions} />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-white transition"
          >
            Update Product
          </button>
        </div>
      </form>
    </main>
  );
}
