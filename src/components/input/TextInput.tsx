import React, { useState } from "react";
import clsx from "clsx";

interface TextInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const shouldFloat = isFocused || value;

  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={clsx(
          "w-full  bg-transparent outline-none pt-6 pb-2 pl-2",
          shouldFloat ? "border-orange-300 border-b-2" : "border-black border-b"
        )}
      />
      <label
        className={clsx(
          "absolute left-0 text-sm transition-all  duration-200",
          shouldFloat
            ? "font-bold top-0 text-xs text-orange-300"
            : "font-semibold top-8 text-black"
        )}
      >
        {label}
      </label>
    </div>
  );
};

export default TextInput;
