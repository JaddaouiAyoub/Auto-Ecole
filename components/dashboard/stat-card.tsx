"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  iconClassName?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  iconClassName,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "glass rounded-xl p-6 border border-border shadow-card-sm hover:shadow-card-md transition-shadow relative overflow-hidden group",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
      
      <div className="flex items-center justify-between relative z-10">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10",
            iconClassName
          )}
        >
          {icon}
        </div>
      </div>
      
      <div className="mt-4 relative z-10">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
        
        {(description || trend) && (
          <div className="flex items-center mt-2 space-x-2">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
                  trend.value > 0
                    ? "text-emerald-600 bg-emerald-500/10"
                    : trend.value < 0
                    ? "text-red-600 bg-red-500/10"
                    : "text-muted-foreground bg-muted"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground truncate">{description}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
