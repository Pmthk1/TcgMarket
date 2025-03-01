"use client";

import * as React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`border rounded-md p-2 text-sm w-full ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
  children: React.ReactNode;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, ...props }) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
};

// ✅ เพิ่มส่วนประกอบที่ขาดหายไปให้ทำงานได้เหมือน `shadcn/ui`
export const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="border p-2 rounded-md">{children}</div>;
};

export const SelectValue: React.FC<{ placeholder: string }> = ({ placeholder }) => {
  return <span className="text-gray-500">{placeholder}</span>;
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="border rounded-md shadow-md mt-2">{children}</div>;
};
