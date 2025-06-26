"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewProductAction } from "@/app/actions/admin/products";


import {
  allCategories,
  AvailabilityStatus,
  ReturnPolicy,
  Tag,
  Product,
} from "@/types/product";

import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import CheckboxGroup from "@/components/shared/CheckboxGroup";
import DimensionFields from "@/components/shared/DimensionFields";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description too short"),
  category: z.string().min(1, "Category is required"),
  availabilityStatus: z.string(),
  returnPolicy: z.string(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
  tags: z.array(z.string()).optional(),
  dimensions: z.object({
    width: z.coerce.number().min(0),
    height: z.coerce.number().min(0),
    depth: z.coerce.number().min(0),
  }),
});

type ProductForm = z.infer<typeof productSchema>;

export default function NewProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      tags: [],
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
      },
    },
  });

  const onSubmit = async (data: ProductForm) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("availabilityStatus", data.availabilityStatus);
    formData.append("returnPolicy", data.returnPolicy);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    data.tags?.forEach((tag) => formData.append("tags", tag));
    formData.append("dimensions.width", data.dimensions.width.toString());
    formData.append("dimensions.height", data.dimensions.height.toString());
    formData.append("dimensions.depth", data.dimensions.depth.toString());

    const result = await addNewProductAction(undefined, formData);
    if (result.success) {
      alert("Product created successfully ✅");
    } else {
      console.error("Backend validation error", result.errors);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="my-6 text-2xl font-semibold">Add a New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField label="Title" {...register("title")} error={errors.title?.message} />
        <InputField label="Description" {...register("description")} error={errors.description?.message} />
        <SelectField label="Category" options={allCategories} {...register("category")} error={errors.category?.message} />
        <SelectField label="Availability Status" options={Object.values(AvailabilityStatus)} {...register("availabilityStatus")} />
        <SelectField label="Return Policy" options={Object.values(ReturnPolicy)} {...register("returnPolicy")} />
        <InputField label="Price" type="number" {...register("price")} error={errors.price?.message} />
        <InputField label="Stock" type="number" {...register("stock")} error={errors.stock?.message} />
        <CheckboxGroup label="Tags" name="tags" options={Object.values(Tag)} register={register} error={errors.tags?.[0]} />
        <DimensionFields register={register} errors={errors.dimensions} />
        <button
          type="submit"
          className="my-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Product
        </button>
      </form>
    </main>
  );
}
