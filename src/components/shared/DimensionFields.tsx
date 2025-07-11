"use client";

import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>["dimensions"] & {
    width?: { message?: string };
    height?: { message?: string };
    depth?: { message?: string };
  };
};

export default function DimensionFields<T extends FieldValues>({
  register,
  errors,
}: Props<T>) {
  return (
    <div className="flex flex-col mb-4">
      <label className="font-medium mb-2 text-gray-100">Dimensions</label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <input
            type="number"
            placeholder="Width"
            {...register("dimensions.width" as Path<T>)}
            className="p-2 border rounded w-full"
          />
          {errors?.width?.message && (
            <p className="text-red-500 text-sm">{errors.width.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="Height"
            {...register("dimensions.height" as Path<T>)}
            className="p-2 border rounded w-full"
          />
          {errors?.height?.message && (
            <p className="text-red-500 text-sm">{errors.height.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="Depth"
            {...register("dimensions.depth" as Path<T>)}
            className="p-2 border rounded w-full"
          />
          {errors?.depth?.message && (
            <p className="text-red-500 text-sm">{errors.depth.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
