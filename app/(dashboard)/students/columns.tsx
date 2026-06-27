"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StudentWithCounts } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { formatCurrency, getInitials, getProgressColor } from "@/lib/utils";
import { STATUS_FR_AR, STATUS_COLORS } from "@/constants";

export const columns: ColumnDef<StudentWithCounts>[] = [
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
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Élève
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
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
            <Link
              href={`/students/${student.id}`}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {student.firstName} {student.lastName}
            </Link>
            <p className="text-[10px] text-muted-foreground mt-0.5">{student.email ?? "Pas d'email"}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "cin",
    header: "CIN",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("cin")}</span>,
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => <span className="text-sm">{row.getValue("phone")}</span>,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof STATUS_FR_AR;
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${STATUS_COLORS[status]}`}
        >
          {STATUS_FR_AR[status].fr}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentPercentage",
    header: "Paiement",
    cell: ({ row }) => {
      const percentage = row.getValue("paymentPercentage") as number;
      const remaining = Number(row.original.remainingAmount);
      return (
        <div className="w-full min-w-[120px] max-w-[150px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-foreground">{percentage.toFixed(0)}%</span>
            <span className="text-muted-foreground">{formatCurrency(remaining)} restant</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor(percentage)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href={`/students/${student.id}`} />} className="cursor-pointer flex items-center">
                <Eye className="w-4 h-4 mr-2" /> Voir le profil
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={`/students/${student.id}/edit`} />} className="cursor-pointer flex items-center">
                <Edit className="w-4 h-4 mr-2" /> Modifier
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={`/payments/new?studentId=${student.id}`} />} className="cursor-pointer flex items-center text-primary">
              <FileText className="w-4 h-4 mr-2" /> Ajouter un paiement
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
