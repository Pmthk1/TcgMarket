import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue",
          data: [1000, 1500, 1800, 2200, 2600, 3000],
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
        },
      ],
    };

    return NextResponse.json(data); // ✅ ต้องใช้ NextResponse.json() เสมอ
  } catch (error) {
    console.error("API Error:", error); // ✅ ล็อก error ดูใน console
    return NextResponse.json({ error: "Failed to fetch trends data" }, { status: 500 });
  }
}
