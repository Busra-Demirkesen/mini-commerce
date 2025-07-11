import { forwardRef } from "react";

type Props = {
  label: string;
  options: string[];
  name?: string;
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectField = forwardRef<HTMLSelectElement, Props>(
  ({ label, options, error, ...rest }, ref) => (
    <div className="flex flex-col mb-4">
      <label className="mb-1 text-gray-900 dark:text-gray-100">{label}</label>
      <select
        ref={ref}
        {...rest}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="">Seçiniz</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
);

SelectField.displayName = "SelectField";

export default SelectField;
