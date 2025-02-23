"use client";

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="bg-white shadow p-4 mb-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
