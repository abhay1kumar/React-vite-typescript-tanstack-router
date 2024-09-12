import React, { useState } from "react";

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => string | null;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  validate,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    if (validate) {
      const validationError = validate(value);
      setError(validationError);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
