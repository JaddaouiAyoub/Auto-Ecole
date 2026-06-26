"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";

import { settingsSchema, type SettingsFormData } from "@/lib/validations";
import { updateSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SettingsFormProps {
  initialData: SettingsFormData;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      const response = await updateSettings(data);

      if (response.success) {
        toast.success("Paramètres mis à jour avec succès");
        // Optionnel : refresh pour mettre à jour la sidebar/header
        window.location.reload();
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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-border p-6 md:p-8 max-w-3xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Informations de l&apos;Auto-École
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName">Nom de l&apos;établissement *</Label>
            <Input id="schoolName" {...register("schoolName")} placeholder="Auto-École Najah" />
            {errors.schoolName && <p className="text-xs text-destructive">{errors.schoolName.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" {...register("phone")} placeholder="06XXXXXXXX" />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email de contact</Label>
          <Input id="email" type="email" {...register("email")} placeholder="contact@autoecole.ma" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse physique</Label>
          <Textarea
            id="address"
            {...register("address")}
            placeholder="Avenue Hassan II, Rabat..."
            className="resize-none"
            rows={3}
          />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Devise (code ISO)</Label>
            <Input id="currency" {...register("currency")} placeholder="MAD" />
            {errors.currency && <p className="text-xs text-destructive">{errors.currency.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="currencySymbol">Symbole de la devise</Label>
            <Input id="currencySymbol" {...register("currencySymbol")} placeholder="DH" />
            {errors.currencySymbol && <p className="text-xs text-destructive">{errors.currencySymbol.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Langue par défaut</Label>
            <select
              id="language"
              {...register("language")}
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="FR">Français (FR)</option>
              <option value="AR">Arabe (AR)</option>
            </select>
            {errors.language && <p className="text-xs text-destructive">{errors.language.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 mt-6 border-t border-border">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer les modifications
        </Button>
      </div>
    </motion.form>
  );
}
