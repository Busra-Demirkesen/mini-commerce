"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewProductAction } from "@/app/actions/admin/products";
import { productSchema } from "@/validations/productSchema";
import { useEffect, useState } from "react";
import Image from "next/image";

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

type ProductForm = z.infer<typeof productSchema>;

export default function NewProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      availabilityStatus: undefined,
      returnPolicy: undefined,
      price: undefined,
      stock: undefined,
      brand: "",
      sku: "",
      weight: undefined,
      warrantyInformation: "",
      shippingInformation: "",
      minimumOrderQuantity: 1,
      tags: [],
      dimensions: {
        width: undefined,
        height: undefined,
        depth: undefined,
      },
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const onSubmit = async (data: ProductForm) => {
    const formData = new FormData();

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
    }

    const emptyState: NewProductFormState = {
      success: false,
      message: "",
      inputs: {},
      errors: {},
    };

    const result = await addNewProductAction(emptyState, formData);

    console.log("Result from addNewProductAction:", result);

    if (result.success) {
      alert("Product created successfully ✅");
      setImagePreview(null);
    } else {
      console.error("Backend validation error", result.errors);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
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
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="Description"
          placeholder="Enter product description"
          {...register("description")}
          error={errors.description?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <SelectField
          label="Category"
          options={Object.values(Category)}
          {...register("category")}
          error={errors.category?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="Price"
          type="number"
          placeholder="Enter product price"
          {...register("price")}
          error={errors.price?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="Stock"
          type="number"
          placeholder="Enter stock quantity"
          {...register("stock")}
          error={errors.stock?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="Brand"
          placeholder="Enter brand name"
          {...register("brand")}
          error={errors.brand?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="SKU"
          placeholder="Enter SKU"
          {...register("sku")}
          error={errors.sku?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="Weight"
          type="number"
          placeholder="Enter product weight"
          {...register("weight")}
          error={errors.weight?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="Warranty Information"
          placeholder="Enter warranty information"
          {...register("warrantyInformation")}
          error={errors.warrantyInformation?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="Shipping Information"
          placeholder="Enter shipping information"
          {...register("shippingInformation")}
          error={errors.shippingInformation?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <InputField
          label="Minimum Order Quantity"
          type="number"
          placeholder="Enter minimum order quantity"
          {...register("minimumOrderQuantity")}
          error={errors.minimumOrderQuantity?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <h2 className="text-md font-semibold text-gray-900 dark:text-gray-100">
          Product Dimensions
        </h2>
        <DimensionFields register={register} errors={errors.dimensions} />

        <CheckboxGroup
          label="Tags"
          name="tags"
          options={Object.values(Tag)}
          register={register}
          error={errors.tags?.[0]?.message}
          labelClassName="text-gray-700 dark:text-gray-100"
        />

        <SelectField
          label="Availability Status"
          options={Object.values(AvailabilityStatus)}
          {...register("availabilityStatus")}
          error={errors.availabilityStatus?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <SelectField
          label="Return Policy"
          options={Object.values(ReturnPolicy)}
          {...register("returnPolicy")}
          error={errors.returnPolicy?.message}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <div className="flex flex-col">
          <label htmlFor="image" className="text-gray-700 dark:text-gray-100 text-sm font-bold mb-2">Product Image</label>
          <input
            type="file"
            id="image"
            accept=".jpeg, .jpg, .webp, .png"
            {...register("image")}
            onChange={(e) => {
              handleImageChange(e);
              register("image").onChange(e);
            }}
            className="dark:bg-gray-700 dark:text-gray-100 p-2 rounded-md"
          />
          {errors.image && (
            <p className="text-red-500 text-xs italic">{errors.image.message as string}</p>
          )}

          {imagePreview && (
            <div className="mt-4 w-48 h-48 relative">
              <Image
                src={imagePreview}
                alt="Product Preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md shadow-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Product
        </button>
      </form>
    </main>
  );
}

export type NewProductFormState = {
  success: boolean;
  message: string;
  inputs?: Record<string, unknown>;
  errors?: Record<string, string[]>;
};

