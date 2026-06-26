"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Eye, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { PAYMENT_METHOD_ICONS, PAYMENT_METHODS } from "@/constants";

type PaymentWithStudent = {
  id: string;
  amount: unknown;
  paymentDate: Date;
  paymentMethod: string;
  description: string | null;
  receiptNumber: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    cin: string;
  };
  createdBy: {
    name: string | null;
  };
};

export const columns: ColumnDef<PaymentWithStudent>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "receiptNumber",
    header: "N° Reçu",
    cell: ({ row }) => (
      <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">
        {row.getValue("receiptNumber")}
      </span>
    ),
  },
  {
    accessorKey: "student",
    header: "Élève",
    cell: ({ row }) => {
      const student = row.original.student;
      return (
        <div className="flex flex-col">
          <Link
            href={`/students/${student.id}`}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {student.firstName} {student.lastName}
          </Link>
          <span className="text-[10px] text-muted-foreground font-mono">
            CIN: {student.cin}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-4 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Montant
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      return <span className="font-bold text-emerald-600">{formatCurrency(amount)}</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Mode",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as keyof typeof PAYMENT_METHODS;
      return (
        <div className="flex items-center gap-1.5 text-sm">
          <span>{PAYMENT_METHOD_ICONS[method]}</span>
          <span>{PAYMENT_METHODS[method]}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-4 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm">{formatDateTime(row.getValue("paymentDate") as Date)}</span>,
  },
  {
    accessorKey: "createdBy",
    header: "Encaissé par",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.createdBy.name ?? "Inconnu"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem render={<Link href={`/students/${payment.student.id}`} />} className="cursor-pointer flex items-center">
              <Eye className="w-4 h-4 mr-2" /> Voir l&apos;élève
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Imprimer le reçu
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex items-center text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" /> Supprimer (Admin)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
