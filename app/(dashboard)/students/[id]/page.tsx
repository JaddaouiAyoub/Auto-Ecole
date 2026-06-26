import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudent, deleteStudent } from "@/actions/students";
import { formatCurrency, formatDate, formatDateTime, getInitials, getProgressColor } from "@/lib/utils";
import { STATUS_FR_AR, STATUS_COLORS, LICENSE_CATEGORIES, PAYMENT_METHOD_ICONS, PAYMENT_METHODS } from "@/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, CreditCard, Plus, AlertCircle, FileText } from "lucide-react";
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
import { revalidatePath } from "next/cache";

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

  // Delete Action handling server-side
  const handleDelete = async () => {
    "use server";
    await deleteStudent(id);
    redirect("/students");
  };

  const status = student.status as keyof typeof STATUS_FR_AR;
  const isCompleted = student.paymentPercentage >= 100;

  return (
    <div className="space-y-6 pb-8 max-w-6xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/students">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {student.firstName} {student.lastName}
              </h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[status]}`}>
                {STATUS_FR_AR[status].fr}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 font-mono">
              CIN: {student.cin}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" asChild>
            <Link href={`/students/${student.id}/edit`}>
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
          </Button>

          {/* Delete Dialog */}
          <AlertDialog>
            <AlertDialogTrigger className={buttonVariants({ variant: "outline", className: "gap-2 text-destructive hover:bg-destructive/10" })}>
              <Trash2 className="w-4 h-4" />
              Supprimer
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action masquera cet élève (suppression logique). Il pourra être restauré depuis la corbeille.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <form action={handleDelete}>
                  <AlertDialogAction type="submit" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Confirmer la suppression
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info & Photo */}
        <div className="space-y-6">
          <div className="glass rounded-2xl border border-border p-6 shadow-card-sm text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />
            
            <div className="w-24 h-24 mx-auto rounded-full bg-secondary border-4 border-background shadow-md flex items-center justify-center overflow-hidden mb-4 relative z-10">
              {student.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={student.photoUrl}
                  alt={student.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  {getInitials(student.firstName, student.lastName)}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1 relative z-10">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-muted-foreground relative z-10 mb-6">
              Inscrit(e) le {formatDate(student.registrationDate)}
            </p>

            <div className="space-y-4 text-left relative z-10">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{student.phone}</p>
                  <p className="text-[10px] text-muted-foreground">Téléphone</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="truncate">
                  <p className="font-medium text-foreground truncate">{student.email || "Non renseigné"}</p>
                  <p className="text-[10px] text-muted-foreground">Email</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground line-clamp-2">{student.address || "Non renseignée"}</p>
                  <p className="text-[10px] text-muted-foreground">Adresse</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{student.birthDate ? formatDate(student.birthDate) : "Non renseignée"}</p>
                  <p className="text-[10px] text-muted-foreground">Date de naissance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border border-border p-6 shadow-card-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Catégorie de Permis</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 text-primary">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-lg">
                {student.licenseCategory}
              </div>
              <p className="font-medium text-sm">
                {LICENSE_CATEGORIES[student.licenseCategory as keyof typeof LICENSE_CATEGORIES]}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Finances, Payments & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Summary */}
          <div className="glass rounded-2xl border border-border p-6 shadow-card-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Situation Financière</h3>
              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Paiement Complet
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Prix Conventionné</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(Number(student.totalPrice))}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-xs text-muted-foreground mb-1">Total Payé</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(Number(student.paidAmount))}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs text-muted-foreground mb-1">Reste à Payer</p>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(Number(student.remainingAmount))}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-foreground">Progression des paiements</span>
                <span className="font-bold">{student.paymentPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(student.paymentPercentage)} transition-all duration-1000 ease-out`}
                  style={{ width: `${student.paymentPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="glass rounded-2xl border border-border p-6 shadow-card-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Historique des Paiements</h3>
              {!isCompleted && (
                <Button size="sm" className="gap-2" asChild>
                  <Link href={`/payments/new?studentId=${student.id}`}>
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </Link>
                </Button>
              )}
            </div>

            {student.payments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Aucun paiement effectué</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Les paiements s&apos;afficheront ici.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {student.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg" title={PAYMENT_METHODS[payment.paymentMethod as keyof typeof PAYMENT_METHODS]}>
                          {PAYMENT_METHOD_ICONS[payment.paymentMethod as keyof typeof PAYMENT_METHOD_ICONS]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(Number(payment.amount))}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(payment.paymentDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md inline-block">
                        {payment.receiptNumber}
                      </p>
                      {payment.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[150px]">
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
