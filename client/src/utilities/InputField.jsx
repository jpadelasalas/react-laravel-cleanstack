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
    options = [], // for radio buttons
    ...customize
  }) => {
    const baseClass =
      "rounded-md border p-2 outline-none transition focus:ring-2 focus:ring-blue-400 ";

    const errorClass = error
      ? "border-red-500 focus:ring-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-blue-500 border-gray-700";

    const combinedClassName = `${baseClass} ${errorClass} ${className}`.trim();

    // 🔘 Radio Input
    if (type === "radio" && Array.isArray(options)) {
      return (
        <div className="flex flex-col">
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
          {error && (
            <p className="text-red-500 text-sm font-medium mt-1">{error}</p>
          )}
        </div>
      );
    }

    // 🧾 Default Input (text, email, etc.)
    return (
      <div className="flex flex-col">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          className={combinedClassName}
          {...customize}
        />
        {error && (
          <p className="text-red-500 text-sm font-medium mt-1">{error}</p>
        )}
      </div>
    );
  }
);

export default InputField;
