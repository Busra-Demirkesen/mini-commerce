import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductForm } from "@/types/forms";

type Props = {
  register: UseFormRegister<ProductForm>;
  errors?: FieldErrors<ProductForm>["dimensions"];
};

export default function DimensionFields({ register, errors }: Props) {
  return (
    <div className="flex flex-col mb-4">
      <label className="font-medium mb-2 text-gray-900 dark:text-gray-100">
        Dimensions
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Width Field */}
        <div>
          <input
            type="number"
            placeholder="Width"
            {...register("dimensions.width")}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
          />
          {errors?.width && (
            <p className="text-red-500 text-sm">{errors.width.message}</p>
          )}
        </div>

        {/* Height Field */}
        <div>
          <input
            type="number"
            placeholder="Height"
            {...register("dimensions.height")}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
          />
          {errors?.height && (
            <p className="text-red-500 text-sm">{errors.height.message}</p>
          )}
        </div>

        {/* Depth Field */}
        <div>
          <input
            type="number"
            placeholder="Depth"
            {...register("dimensions.depth")}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
          />
          {errors?.depth && (
            <p className="text-red-500 text-sm">{errors.depth.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
