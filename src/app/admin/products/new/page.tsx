"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewProductAction } from "@/app/actions/admin/products";

import {
  Category,
  AvailabilityStatus,
  ReturnPolicy,
  Tag,
} from "@/types/product";

import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import CheckboxGroup from "@/components/shared/CheckboxGroup";
import DimensionFields from "@/components/shared/DimensionFields";

// ✅ Schema: category, availabilityStatus, returnPolicy now use enum values directly
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description too short"),
  category: z.nativeEnum(Category, { errorMap: () => ({ message: "Category is required" }) }),
  availabilityStatus: z.nativeEnum(AvailabilityStatus),
  returnPolicy: z.nativeEnum(ReturnPolicy),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
  tags: z.array(z.nativeEnum(Tag)).optional(),
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
    <main className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Add New Product
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        <InputField
          label="Title"
          placeholder="Enter product title"
          {...register("title")}
          error={errors.title?.message}
        />
        <InputField
          label="Description"
          placeholder="Enter product description"
          {...register("description")}
          error={errors.description?.message}
        />

        {/* ✅ Category options updated to use enum values */}
        <SelectField
          label="Category"
          options={Object.values(Category)}
          {...register("category")}
          error={errors.category?.message}
        />

        <InputField
          label="Price"
          type="number"
          placeholder="Enter product price"
          {...register("price")}
          error={errors.price?.message}
        />
        <InputField
          label="Stock"
          type="number"
          placeholder="Enter stock quantity"
          {...register("stock")}
          error={errors.stock?.message}
        />

        <h2 className="text-md font-semibold text-neutral-800">
          Product Dimensions
        </h2>
        <DimensionFields register={register} errors={errors.dimensions} />

        {/* ✅ Tags checkbox updated to use enum values */}
        <CheckboxGroup
          label="Tags"
          name="tags"
          options={Object.values(Tag)}
          register={register}
          error={errors.tags?.[0]}
        />

        {/* ✅ Availability Status uses enum values */}
        <SelectField
          label="Availability Status"
          options={Object.values(AvailabilityStatus)}
          {...register("availabilityStatus")}
        />

        {/* ✅ Return Policy uses enum values */}
        <SelectField
          label="Return Policy"
          options={Object.values(ReturnPolicy)}
          {...register("returnPolicy")}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-md hover:opacity-90"
          >
            Add Product
          </button>
        </div>
      </form>
    </main>
  );
}
