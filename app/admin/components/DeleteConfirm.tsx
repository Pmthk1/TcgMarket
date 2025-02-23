"use client";

export default function DeleteConfirm({ productId }: { productId: string }) {
  const handleDelete = async () => {
    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });

    if (res.ok) {
      alert("ลบสินค้าสำเร็จ!");
      window.location.reload();
    } else {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded">
      ลบ
    </button>
  );
}
