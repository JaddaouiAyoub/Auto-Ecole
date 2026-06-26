"use client";

import Link from "next/link";
import { formatCurrency, formatRelativeTime, getInitials } from "@/lib/utils";
import { PAYMENT_METHOD_ICONS, PAYMENT_METHODS } from "@/constants";

interface RecentPayment {
  id: string;
  amount: unknown; // Decimal
  paymentDate: Date;
  paymentMethod: string;
  receiptNumber: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
  };
}

interface RecentPaymentsProps {
  payments: RecentPayment[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">Aucun paiement récent</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Link href={`/students/${payment.student.id}`}>
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                {payment.student.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={payment.student.photoUrl}
                    alt={`${payment.student.firstName} ${payment.student.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-primary">
                    {getInitials(payment.student.firstName, payment.student.lastName)}
                  </span>
                )}
              </div>
            </Link>
            <div>
              <Link
                href={`/students/${payment.student.id}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {payment.student.firstName} {payment.student.lastName}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>
                  {PAYMENT_METHOD_ICONS[payment.paymentMethod as keyof typeof PAYMENT_METHOD_ICONS]}{" "}
                  {PAYMENT_METHODS[payment.paymentMethod as keyof typeof PAYMENT_METHODS]}
                </span>
                <span>•</span>
                <span>{formatRelativeTime(payment.paymentDate)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">
              +{formatCurrency(Number(payment.amount))}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              {payment.receiptNumber}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
