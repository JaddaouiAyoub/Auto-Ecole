"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { paymentSchema, type PaymentFormData } from "@/lib/validations";
import { createPayment } from "@/actions/payments";
import { PAYMENT_METHOD_OPTIONS } from "@/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

interface StudentBasicInfo {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
  remainingAmount: unknown;
}

interface PaymentFormProps {
  students: StudentBasicInfo[];
  preselectedStudentId?: string;
}

export function PaymentForm({ students, preselectedStudentId }: PaymentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: preselectedStudentId || "",
      amount: 0,
      paymentDate: new Date(),
      paymentMethod: "CASH",
      description: "",
    },
  });

  const selectedStudentId = watch("studentId");
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true);
    try {
      const response = await createPayment(data);

      if (response.success) {
        toast.success("Paiement enregistré avec succès");
        router.push("/payments");
        router.refresh();
      } else {
        toast.error(response.error ?? "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={preselectedStudentId ? `/students/${preselectedStudentId}` : "/payments"}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nouveau Paiement</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enregistrer un nouveau paiement pour un élève.
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-border p-6 md:p-8 space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Élève *</Label>
            <select
              id="studentId"
              {...register("studentId")}
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={!!preselectedStudentId}
            >
              <option value="">Sélectionner un élève</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.cin}) - Reste: {formatCurrency(Number(s.remainingAmount))}
                </option>
              ))}
            </select>
            {errors.studentId && <p className="text-xs text-destructive">{errors.studentId.message}</p>}
          </div>

          {selectedStudent && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-500 flex items-center justify-between text-sm">
              <span>Solde restant à payer:</span>
              <span className="font-bold">{formatCurrency(Number(selectedStudent.remainingAmount))}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Montant (DH) *</Label>
            <Input
              id="amount"
              type="number"
              step="50"
              placeholder="ex: 1500"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Date du paiement *</Label>
              <Input
                id="paymentDate"
                type="date"
                {...register("paymentDate", { valueAsDate: true })}
              />
              {errors.paymentDate && <p className="text-xs text-destructive">{errors.paymentDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Mode de paiement *</Label>
              <select
                id="paymentMethod"
                {...register("paymentMethod")}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {PAYMENT_METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optionnelle)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Ex: Acompte 1, Solde final, etc."
              className="resize-none"
              rows={2}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Button variant="outline" type="button" asChild>
            <Link href={preselectedStudentId ? `/students/${preselectedStudentId}` : "/payments"}>
              Annuler
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer le paiement
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
