"use client";

import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
  /** Pass a numeric value for animated counter */
  numericValue?: number;
  suffix?: string;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent =
            Math.round(v).toLocaleString("fr-FR") + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
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
  numericValue,
  suffix,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative rounded-[24px] border border-border/40 bg-card/50 backdrop-blur-xl p-6 overflow-hidden group cursor-default",
        "shadow-sm hover:shadow-md",
        "transition-all duration-300",
        className
      )}
    >
      {/* Gradient highlight on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/[0.04] group-hover:bg-primary/[0.07] transition-colors duration-500" />
      <div className="absolute -right-3 -top-3 w-14 h-14 rounded-full bg-primary/[0.03] group-hover:bg-primary/[0.05] transition-colors duration-500" />

      {/* Header Row */}
      <div className="flex items-start justify-between relative z-10">
        <p className="text-[13px] font-medium text-muted-foreground tracking-wide leading-tight">
          {title}
        </p>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            "bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300",
            "shadow-inner",
            iconClassName
          )}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="mt-6 relative z-10">
        <h3 className="text-5xl font-extrabold tracking-tighter text-foreground leading-none">
          {numericValue !== undefined ? (
            <AnimatedNumber value={numericValue} suffix={suffix} />
          ) : (
            value
          )}
        </h3>

        {/* Trend + Description */}
        {(description || trend) && (
          <div className="flex items-center mt-3 gap-2">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                  trend.value > 0
                    ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/15"
                    : trend.value < 0
                    ? "text-red-500 bg-red-500/10 dark:text-red-400 dark:bg-red-500/15"
                    : "text-muted-foreground bg-muted"
                )}
              >
                {trend.value > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : trend.value < 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-[12px] text-muted-foreground truncate">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
