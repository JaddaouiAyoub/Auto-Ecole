"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { studentSchema, type StudentFormData } from "@/lib/validations";
import { createStudent, updateStudent } from "@/actions/students";
import { LICENSE_CATEGORY_OPTIONS } from "@/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StudentFormProps {
  initialData?: StudentFormData & { id?: string };
  isEdit?: boolean;
}

export function StudentForm({ initialData, isEdit = false }: StudentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      cin: "",
      phone: "",
      email: "",
      address: "",
      licenseCategory: "B",
      totalPrice: 4500,
      status: "ACTIVE",
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    try {
      const response = isEdit && initialData?.id
        ? await updateStudent(initialData.id, data)
        : await createStudent(data);

      if (response.success) {
        toast.success(isEdit ? "Élève modifié avec succès" : "Élève créé avec succès");
        router.push(isEdit ? `/students/${initialData?.id}` : "/students");
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
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={isEdit ? `/students/${initialData?.id}` : "/students"}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isEdit ? "Modifier l'élève" : "Nouvel Élève"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Remplissez les informations ci-dessous.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-border p-6 md:p-8 space-y-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold border-b border-border pb-2">
              Informations Personnelles
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input id="firstName" {...register("firstName")} placeholder="Ahmed" />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input id="lastName" {...register("lastName")} placeholder="Alami" />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cin">CIN *</Label>
                <Input id="cin" {...register("cin")} placeholder="AB123456" className="uppercase" />
                {errors.cin && <p className="text-xs text-destructive">{errors.cin.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input id="phone" {...register("phone")} placeholder="06XXXXXXXX" />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="ahmed@example.com" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea id="address" {...register("address")} placeholder="Adresse complète..." className="resize-none" rows={3} />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>
          </div>

          {/* Informations d'inscription */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold border-b border-border pb-2">
              Détails de l&apos;inscription
            </h3>

            <div className="space-y-2">
              <Label htmlFor="licenseCategory">Catégorie de Permis *</Label>
              <select
                id="licenseCategory"
                {...register("licenseCategory")}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {LICENSE_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.licenseCategory && <p className="text-xs text-destructive">{errors.licenseCategory.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPrice">Prix Total Conventionné (DH) *</Label>
              <Input
                id="totalPrice"
                type="number"
                step="50"
                {...register("totalPrice", { valueAsNumber: true })}
              />
              {errors.totalPrice && <p className="text-xs text-destructive">{errors.totalPrice.message}</p>}
            </div>
            
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="status">Statut du dossier</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ACTIVE">Actif (En cours)</option>
                  <option value="COMPLETED">Terminé (Permis obtenu)</option>
                  <option value="SUSPENDED">Suspendu</option>
                </select>
                {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Button variant="outline" type="button" asChild>
            <Link href={isEdit ? `/students/${initialData?.id}` : "/students"}>Annuler</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Enregistrer" : "Créer l'élève"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
