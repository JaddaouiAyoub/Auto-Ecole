"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency, formatRelativeTime, getInitials } from "@/lib/utils";
import { PAYMENT_METHOD_ICONS, PAYMENT_METHODS } from "@/constants";
import { ArrowUpRight } from "lucide-react";

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

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

export function RecentPayments({ payments }: RecentPaymentsProps) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
          <span className="text-lg">💸</span>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Aucun paiement récent</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {payments.map((payment, index) => (
        <motion.div
          key={payment.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <Link
            href={`/students/${payment.student.id}`}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/60 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm`}>
                {payment.student.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={payment.student.photoUrl}
                    alt={`${payment.student.firstName} ${payment.student.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-bold text-white">
                    {getInitials(payment.student.firstName, payment.student.lastName)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {payment.student.firstName} {payment.student.lastName}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                  <span>
                    {PAYMENT_METHOD_ICONS[payment.paymentMethod as keyof typeof PAYMENT_METHOD_ICONS]}{" "}
                    {PAYMENT_METHODS[payment.paymentMethod as keyof typeof PAYMENT_METHODS]}
                  </span>
                  <span className="text-border">·</span>
                  <span>{formatRelativeTime(payment.paymentDate)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <div className="text-right">
                <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(Number(payment.amount))}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {payment.receiptNumber}
                </p>
              </div>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
