"use client";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

export default function ReportChart() {
  return <Line data={data} />;
}
