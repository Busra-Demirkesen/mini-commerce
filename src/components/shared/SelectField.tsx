import { forwardRef } from 'react';

type Props = {
  label: string;
  options: string[]; 
  name?: string;
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectField = forwardRef<HTMLSelectElement, Props>(
  ({ label, options, error, ...rest }, ref) => (
    <div className="flex flex-col mb-4">
      <label>{label}</label>
      <select ref={ref} {...rest} className="p-2 border rounded">
        <option value="">Seçiniz</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
);

SelectField.displayName = "SelectField"; // 🔵 forwardRef için şart

export default SelectField;
