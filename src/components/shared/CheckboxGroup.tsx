import { UseFormRegister, Path } from "react-hook-form";
import { EditProductForm } from "@/types/forms";

type Props = {
  label: string;
  name: Path<EditProductForm>;
  options: string[];
  register: UseFormRegister<EditProductForm>;
  error?: string;
};

export default function CheckboxGroup({
  label,
  name,
  options,
  register,
  error,
}: Props) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-2 font-medium">{label}</label>
      <div className="flex gap-4 flex-wrap">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-white">
            <input type="checkbox" value={option} {...register(name)} />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
