"use client";
import React, { TextareaHTMLAttributes, useId } from "react";

export function Textarea({
  label,
  error,
  className = "",
  id,
  rows = 4,
  ...props
}: Props) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium">
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={`px-4 py-2 rounded border resize-none focus:outline-none transition focus:ring-0
        ${error ? "border-red-500" : "border-gray-300"}
        ${className}`}
        {...props}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};
