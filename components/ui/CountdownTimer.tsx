"use client";
import { useEffect, useState, useCallback } from "react";

type CountdownTimerProps = {
  endTime: string; // เวลาสิ้นสุดการประมูล (ISO 8601 format)
};

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(endTime).getTime() - new Date().getTime();
    if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [endTime]); // ✅ เพิ่ม endTime เป็น dependency

  const formatEndDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatEndTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]); // ✅ เพิ่ม calculateTimeLeft เป็น dependency

  return (
    <div className="text-red-500 font-bold">
      <p>📅 สิ้นสุด: {formatEndDate(endTime)} {formatEndTime(endTime)}</p>
      <p>⏳ เหลือเวลา: {timeLeft.hours} ชม. {timeLeft.minutes} นาที {timeLeft.seconds} วิ</p>
    </div>
  );
}
