import { forwardRef } from 'react';

type Props = {
  label: string;
  name?: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, Props>(
  ({ label, type = "text", error, ...rest }, ref) => {
    return (
      <div className="flex flex-col mb-4">
        <label className="mb-1 text-gray-900 dark:text-gray-100">{label}</label>
        <input
          type={type}
          ref={ref}
          {...rest}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
