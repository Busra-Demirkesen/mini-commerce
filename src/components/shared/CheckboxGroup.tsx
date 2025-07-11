import { UseFormRegister, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  options: string[];
  register: UseFormRegister<T>;
  error?: string;
};

export default function CheckboxGroup<T extends FieldValues>({
  label,
  name,
  options,
  register,
  error,
}: Props<T>) {
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
