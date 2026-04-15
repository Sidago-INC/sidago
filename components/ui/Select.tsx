"use client";
import React, { SelectHTMLAttributes, useId } from "react";

export function Select({
  label,
  error,
  className = "",
  id,
  options,
  placeholder = "Select an option",
  ...props
}: Props) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium">
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={`px-4 py-2 rounded border bg-white text-slate-900 focus:outline-none transition focus:ring-0 dark:bg-gray-800 dark:text-gray-100
        ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
        ${className}`}
        {...props}
      >
        {/* Placeholder */}
        <option value="" disabled hidden>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

type Option = {
  label: string;
  value: string | number;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
};
