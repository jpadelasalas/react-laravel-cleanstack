import React from "react";

const InputField = React.memo(
  ({
    type = "text",
    name,
    placeholder,
    value,
    className = "",
    onChange,
    error,
    options = [], // only used for radios
    ...customize
  }) => {
    const errorClass = error ? "border-red-500" : "";
    const baseClass =
      "rounded-md border border-gray-300 dark:border-gray-700 p-2 outline-none focus:ring-2 focus:ring-blue-400 transition";
    const combinedClassName = `${baseClass} ${className} ${errorClass}`.trim();

    // 🔘 If radio: render list of options
    if (type === "radio" && Array.isArray(options)) {
      return (
        <div className="flex flex-wrap gap-3">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="accent-blue-500 cursor-pointer"
                {...customize}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      );
    }

    // 🧾 Default input (text, number, password, etc.)
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        className={combinedClassName}
        {...customize}
      />
    );
  }
);

export default InputField;
