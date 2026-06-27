"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency, getInitials, getProgressColor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentWithBalance {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
  photoUrl: string | null;
  totalPrice: unknown;
  paidAmount: unknown;
  remainingAmount: unknown;
  paymentPercentage: number;
}

interface StudentsWithBalanceProps {
  students: StudentWithBalance[];
}

export function StudentsWithBalance({ students }: StudentsWithBalanceProps) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
          <span className="text-lg">✅</span>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Aucun solde impayé</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Tous les Candidats sont à jour</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {students.map((student, index) => {
        const pct = student.paymentPercentage;
        const urgency = pct < 30 ? "high" : pct < 60 ? "medium" : "low";
        
        return (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Link
              href={`/students/${student.id}`}
              className="flex flex-col p-2.5 rounded-xl hover:bg-muted/60 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0",
                    urgency === "high"
                      ? "bg-red-500/10 ring-1 ring-red-500/20"
                      : urgency === "medium"
                      ? "bg-amber-500/10 ring-1 ring-amber-500/20"
                      : "bg-secondary ring-1 ring-border"
                  )}>
                    {student.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={student.photoUrl}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className={cn(
                        "text-[11px] font-bold",
                        urgency === "high" ? "text-red-500" : urgency === "medium" ? "text-amber-500" : "text-muted-foreground"
                      )}>
                        {getInitials(student.firstName, student.lastName)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {student.cin}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <div className="text-right">
                    <p className={cn(
                      "text-[13px] font-bold",
                      urgency === "high" ? "text-red-500" : urgency === "medium" ? "text-amber-500" : "text-foreground"
                    )}>
                      {formatCurrency(Number(student.remainingAmount))}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      / {formatCurrency(Number(student.totalPrice))}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    urgency === "high" ? "bg-red-500" : urgency === "medium" ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">{pct.toFixed(0)}% payé</span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
