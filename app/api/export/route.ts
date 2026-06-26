import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as xlsx from "xlsx";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "students" | "payments"
    const searchQuery = searchParams.get("search");

    let data: any[] = [];
    let filename = "";
    const dateStr = format(new Date(), "yyyy-MM-dd_HH-mm");

    if (type === "students") {
      filename = `eleves_${dateStr}.xlsx`;
      const students = await db.student.findMany({
        where: searchQuery ? {
          OR: [
            { firstName: { contains: searchQuery, mode: "insensitive" } },
            { lastName: { contains: searchQuery, mode: "insensitive" } },
            { cin: { contains: searchQuery, mode: "insensitive" } },
          ],
        } : undefined,
        orderBy: { createdAt: "desc" },
      });

      data = students.map((s) => ({
        "Prénom": s.firstName,
        "Nom": s.lastName,
        "CIN": s.cin,
        "Téléphone": s.phone,
        "Email": s.email || "",
        "Adresse": s.address || "",
        "Catégorie Permis": s.licenseCategory,
        "Date Inscription": format(s.registrationDate, "dd/MM/yyyy"),
        "Statut": s.status === "ACTIVE" ? "Actif" : s.status === "COMPLETED" ? "Terminé" : "Suspendu",
        "Prix Conventionné": Number(s.totalPrice),
        "Total Payé": Number(s.paidAmount),
        "Reste à Payer": Number(s.remainingAmount),
        "Progression": `${s.paymentPercentage.toFixed(2)}%`,
      }));
    } else if (type === "payments") {
      filename = `paiements_${dateStr}.xlsx`;
      const payments = await db.payment.findMany({
        where: searchQuery ? {
          receiptNumber: { contains: searchQuery, mode: "insensitive" },
        } : undefined,
        include: {
          student: true,
          createdBy: { select: { name: true } },
        },
        orderBy: { paymentDate: "desc" },
      });

      data = payments.map((p) => ({
        "N° Reçu": p.receiptNumber,
        "Date": format(p.paymentDate, "dd/MM/yyyy", { locale: fr }),
        "Élève": `${p.student.firstName} ${p.student.lastName}`,
        "CIN Élève": p.student.cin,
        "Montant (MAD)": Number(p.amount),
        "Mode de paiement": p.paymentMethod,
        "Description": p.description || "",
        "Encaissé par": p.createdBy.name || "Inconnu",
      }));
    } else {
      return new NextResponse("Invalid export type", { status: 400 });
    }

    // Generate Excel file
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, type === "students" ? "Élèves" : "Paiements");

    // Adjust column widths
    const wscols = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
    worksheet["!cols"] = wscols;

    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[EXPORT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
