import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudent, deleteStudent } from "@/actions/students";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { STATUS_FR_AR, STATUS_COLORS, LICENSE_CATEGORIES, PAYMENT_METHOD_ICONS, PAYMENT_METHODS } from "@/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, CreditCard, Plus, CheckCircle2, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    notFound();
  }

  const handleDelete = async () => {
    "use server";
    await deleteStudent(id);
    redirect("/students");
  };

  const status = student.status as keyof typeof STATUS_FR_AR;
  const isCompleted = student.paymentPercentage >= 100;
  const pct = student.paymentPercentage;
  const urgency = pct < 30 ? "high" : pct < 60 ? "medium" : pct < 100 ? "good" : "done";

  return (
    <div className="space-y-6 pb-8 max-w-6xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="flex-shrink-0">
            <Link href="/students">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {student.firstName} {student.lastName}
              </h2>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border",
                STATUS_COLORS[status]
              )}>
                {STATUS_FR_AR[status].fr}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              CIN: {student.cin}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href={`/students/${student.id}/edit`}>
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger className={buttonVariants({ variant: "outline", size: "sm", className: "gap-2 text-destructive hover:bg-destructive/5 hover:border-destructive/30" })}>
              <Trash2 className="w-4 h-4" />
              Supprimer
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action masquera cet élève (suppression logique). Les données peuvent être restaurées ultérieurement.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <form action={handleDelete}>
                  <AlertDialogAction type="submit" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Confirmer
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent" />
            
            {/* Avatar */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-4 border-background shadow-lg flex items-center justify-center overflow-hidden mb-3">
                {student.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={student.photoUrl}
                    alt={student.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {getInitials(student.firstName, student.lastName)}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inscrit(e) le {formatDate(student.registrationDate)}
              </p>
            </div>

            {/* Contact Info */}
            <div className="mt-5 space-y-3 border-t border-border/40 pt-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{student.phone}</p>
                  <p className="text-[10px] text-muted-foreground">Téléphone</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{student.email || "Non renseigné"}</p>
                  <p className="text-[10px] text-muted-foreground">Email</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{student.address || "Non renseignée"}</p>
                  <p className="text-[10px] text-muted-foreground">Adresse</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{student.birthDate ? formatDate(student.birthDate) : "Non renseignée"}</p>
                  <p className="text-[10px] text-muted-foreground">Date de naissance</p>
                </div>
              </div>
            </div>
          </div>

          {/* License Category */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Catégorie de permis</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center font-bold text-lg text-primary">
                {student.licenseCategory}
              </div>
              <p className="font-medium text-sm text-foreground">
                {LICENSE_CATEGORIES[student.licenseCategory as keyof typeof LICENSE_CATEGORIES]}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Finances & Payments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Summary */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-foreground">Situation financière</h3>
              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Soldé
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-secondary/40 border border-border/40">
                <p className="text-[11px] font-medium text-muted-foreground mb-1">Prix total</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(Number(student.totalPrice))}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <p className="text-[11px] font-medium text-muted-foreground mb-1">Payé</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(Number(student.paidAmount))}</p>
              </div>
              <div className={cn(
                "p-4 rounded-xl border",
                urgency === "done" ? "bg-emerald-500/5 border-emerald-500/15" :
                urgency === "high" ? "bg-red-500/5 border-red-500/15" :
                urgency === "medium" ? "bg-amber-500/5 border-amber-500/15" :
                "bg-blue-500/5 border-blue-500/15"
              )}>
                <p className="text-[11px] font-medium text-muted-foreground mb-1">Restant</p>
                <p className={cn(
                  "text-lg font-bold",
                  urgency === "done" ? "text-emerald-600 dark:text-emerald-400" :
                  urgency === "high" ? "text-red-500" :
                  urgency === "medium" ? "text-amber-500" :
                  "text-blue-500"
                )}>{formatCurrency(Number(student.remainingAmount))}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-muted-foreground">Progression</span>
                <span className={cn(
                  "font-bold",
                  urgency === "done" ? "text-emerald-600 dark:text-emerald-400" :
                  urgency === "high" ? "text-red-500" :
                  urgency === "medium" ? "text-amber-500" : "text-blue-500"
                )}>{pct.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    urgency === "done" ? "bg-emerald-500" :
                    urgency === "high" ? "bg-red-500" :
                    urgency === "medium" ? "bg-amber-500" : "bg-blue-500"
                  )}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-foreground">Historique des paiements</h3>
              {!isCompleted && (
                <Button size="sm" className="gap-1.5 h-8" asChild>
                  <Link href={`/payments/new?studentId=${student.id}`}>
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter
                  </Link>
                </Button>
              )}
            </div>

            {student.payments.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Aucun paiement enregistré</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Les paiements apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {student.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-base" title={PAYMENT_METHODS[payment.paymentMethod as keyof typeof PAYMENT_METHODS]}>
                          {PAYMENT_METHOD_ICONS[payment.paymentMethod as keyof typeof PAYMENT_METHOD_ICONS]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(Number(payment.amount))}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(payment.paymentDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-lg inline-block">
                        {payment.receiptNumber}
                      </p>
                      {payment.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[140px]">
                          {payment.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
