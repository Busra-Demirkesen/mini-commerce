"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { EditProductForm } from "@/types/forms";

type Props = {
  register: UseFormRegister<EditProductForm>;
  errors?: FieldErrors<EditProductForm>;
};

export default function DimensionFields({ register, errors }: Props) {
  const dimensionsErrors = errors?.dimensions;

  return (
    <div className="flex flex-col mb-4">
      <label className="font-medium mb-2 text-gray-100">Dimensions</label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Width */}
        <div>
          <input
            type="number"
            placeholder="Width"
            {...register("dimensions.width")}
            className="p-2 border rounded w-full"
          />
          {dimensionsErrors?.width && (
            <p className="text-red-500 text-sm">{dimensionsErrors.width.message}</p>
          )}
        </div>

        {/* Height */}
        <div>
          <input
            type="number"
            placeholder="Height"
            {...register("dimensions.height")}
            className="p-2 border rounded w-full"
          />
          {dimensionsErrors?.height && (
            <p className="text-red-500 text-sm">{dimensionsErrors.height.message}</p>
          )}
        </div>

        {/* Depth */}
        <div>
          <input
            type="number"
            placeholder="Depth"
            {...register("dimensions.depth")}
            className="p-2 border rounded w-full"
          />
          {dimensionsErrors?.depth && (
            <p className="text-red-500 text-sm">{dimensionsErrors.depth.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
