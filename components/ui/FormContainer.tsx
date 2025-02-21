"use client";  // ต้องเพิ่มบรรทัดนี้เพื่อให้เป็น Client Component

import { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
  action: (formData: FormData) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, action }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    action(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {children}
    </form>
  );
};

export default FormContainer;
