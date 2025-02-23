import { cn } from "@/lib/utils";
import React from "react";

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={cn("rounded-lg border bg-white p-6 shadow", className)}>
      {children}
    </div>
  );
};

export default Card;
