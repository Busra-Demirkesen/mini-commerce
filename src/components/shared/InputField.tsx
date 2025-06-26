import { forwardRef} from 'react';
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
        <label>{label}</label>
        <input
          type={type}
          ref={ref}
          {...rest}
          className="p-2 border rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField"; 

export default InputField;