import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { motion } from "framer-motion";

type InputFieldProps = {
  id: string;
  type?: string;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  borderColor?: string;
  labelColor?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  type = "text",
  label,
  icon,
  placeholder,
  error,
  register,
  borderColor = "border-gray-300 focus:ring-gray-500 focus:border-gray-500",
  labelColor = "text-gray-700",
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className={`flex items-center text-sm font-medium ${labelColor}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register}
          className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 ${borderColor}`}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {error.message}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default InputField;
