import { cn } from "@/lib/utils";
import React from "react";

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={cn("rounded-lg border bg-white p-6 shadow", className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="border-b pb-4 mb-4">{children}</div>;
};

const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };
