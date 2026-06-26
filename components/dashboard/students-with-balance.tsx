"use client";

import Link from "next/link";
import { formatCurrency, getInitials, getProgressColor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">Aucun élève avec solde impayé</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <Link
          key={student.id}
          href={`/students/${student.id}`}
          className="flex flex-col p-3 rounded-xl hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                {student.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={student.photoUrl}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground">
                    {getInitials(student.firstName, student.lastName)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{student.cin}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-bold text-destructive">
                  {formatCurrency(Number(student.remainingAmount))}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  sur {formatCurrency(Number(student.totalPrice))}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor(student.paymentPercentage)} transition-all duration-1000 ease-out`}
              style={{ width: `${student.paymentPercentage}%` }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
