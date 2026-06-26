import { notFound } from "next/navigation";
import { getPayment } from "@/actions/payments";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { getSettings } from "@/actions/settings";
import { Car, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await getPayment(id);
  const settings = await getSettings();

  if (!payment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 print:bg-white print:p-0 print:py-0">
      {/* Controls - Hidden on print */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link href="/payments" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimer le reçu
        </Button>
      </div>

      {/* Receipt Paper */}
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg rounded-none sm:rounded-xl p-8 md:p-12 print:shadow-none print:border-none print:p-0 text-black">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{settings?.schoolName ?? "Auto-École Manager"}</h1>
              <p className="text-gray-500 text-sm mt-1">{settings?.address ?? "Adresse non renseignée"}</p>
              <div className="text-gray-500 text-sm mt-1 flex gap-4">
                <span>Tél: {settings?.phone ?? "-"}</span>
                <span>Email: {settings?.email ?? "-"}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-light text-gray-900 tracking-tight">REÇU</h2>
            <p className="font-mono text-sm font-semibold mt-2 text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
              N° {payment.receiptNumber}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reçu de</p>
            <p className="font-semibold text-gray-900 text-lg">
              {payment.student.firstName} {payment.student.lastName}
            </p>
            <p className="text-gray-500 text-sm mt-1">CIN: {payment.student.cin}</p>
            <p className="text-gray-500 text-sm">Catégorie: Permis {payment.student.licenseCategory}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Détails du paiement</p>
            <p className="text-gray-900 font-medium">{formatDateTime(payment.paymentDate)}</p>
            <p className="text-gray-500 text-sm mt-1">Mode: {payment.paymentMethod}</p>
            <p className="text-gray-500 text-sm">Encaissé par: {payment.createdBy.name}</p>
          </div>
        </div>

        {/* Payment Details Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-900">
              <tr>
                <td className="px-6 py-5">
                  <p className="font-medium">Paiement formation permis {payment.student.licenseCategory}</p>
                  {payment.description && (
                    <p className="text-gray-500 text-sm mt-1">{payment.description}</p>
                  )}
                </td>
                <td className="px-6 py-5 text-right font-bold text-lg">
                  {formatCurrency(Number(payment.amount))}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 text-gray-900">
              <tr>
                <td className="px-6 py-4 text-right font-semibold text-sm">Montant Total Payé</td>
                <td className="px-6 py-4 text-right font-bold text-xl text-primary">
                  {formatCurrency(Number(payment.amount))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12 flex justify-between items-center border border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Prix Total</p>
            <p className="font-semibold text-gray-900">{formatCurrency(Number(payment.student.totalPrice))}</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div>
            <p className="text-sm text-gray-500">Total Payé (inclut ce reçu)</p>
            <p className="font-semibold text-emerald-600">{formatCurrency(Number(payment.student.paidAmount))}</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Reste à Payer</p>
            <p className="font-semibold text-amber-600">{formatCurrency(Number(payment.student.remainingAmount))}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end pt-8">
          <div className="text-center w-48">
            <div className="h-px w-full bg-gray-300 mb-2"></div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Signature Élève</p>
          </div>
          <div className="text-center w-48">
            <div className="h-px w-full bg-gray-300 mb-2"></div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Cachet & Signature Auto-École</p>
          </div>
        </div>

        <div className="mt-16 text-center text-xs text-gray-400">
          <p>Merci pour votre confiance. Ce reçu est généré électroniquement.</p>
          <p className="font-mono mt-1">{payment.id}</p>
        </div>
      </div>
    </div>
  );
}
