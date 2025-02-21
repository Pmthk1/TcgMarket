import React from "react";

interface AdminCardProps {
  title: string;
  value: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default AdminCard; // ✅ ต้องมี export default
