"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle, Mail, Lock, ArrowRight } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.success("Connexion réussie !");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau gauche — image plein écran ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80"
          alt="Conduite automobile"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1930]/85 via-[#0f2347]/65 to-[#1a3a6b]/40" />

        {/* Contenu */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5.5 14.5l2-5A1.5 1.5 0 019 8.5h6a1.5 1.5 0 011.5 1l2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 14.5h18v3.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-3.5z" fill="white" fillOpacity=".2" stroke="white" strokeWidth="1.5"/>
                <circle cx="7.5" cy="18.5" r="1.4" stroke="white" strokeWidth="1.3"/>
                <circle cx="16.5" cy="18.5" r="1.4" stroke="white" strokeWidth="1.3"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">Auto-École Manager</span>
          </div>

          {/* Bas */}
          <div>
            <h2 className="text-white text-[32px] font-bold leading-tight tracking-tight mb-3">
              Gérez votre auto-école<br />en toute simplicité
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-[300px]">
              Suivi des élèves, planning des moniteurs, gestion des paiements — tout en un seul endroit.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              {[
                { value: "500+", label: "Auto-écoles" },
                { value: "98%", label: "Satisfaction" },
                { value: "24/7", label: "Disponible" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-white text-xl font-bold tracking-tight">{value}</p>
                  <p className="text-white/45 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-white/20 text-[10px] mt-10">
              Photo by Štefan Štefančík on Unsplash
            </p>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — fond image + glassmorphism ── */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">

        {/* Même image en fond du panneau droit */}
        <Image
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80"
          alt=""
          fill
          className="object-cover lg:hidden"
          aria-hidden
        />

        {/* Fond uni desktop + overlay léger */}
        <div className="absolute inset-0 bg-[#f0f4fb] dark:bg-[#0d1220] lg:bg-[#eef2f9] dark:lg:bg-[#0d1220]" />

        {/* Blobs décoratifs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-3xl pointer-events-none" />

        {/* Carte glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[400px] mx-6"
        >
          {/* Glass card */}
          <div className="
            bg-white/80 dark:bg-white/[0.04]
            backdrop-blur-2xl
            border border-white/70 dark:border-white/10
            rounded-[24px]
            shadow-[0_8px_40px_-8px_rgba(15,35,80,0.18),0_2px_8px_-2px_rgba(15,35,80,0.08)]
            dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)]
            overflow-hidden
          ">

            {/* Bande top colorée fine */}
            <div className="h-[3px] w-full bg-gradient-to-r from-[#1e40af] via-[#3b6cf4] to-[#7c3aed]" />

            <div className="px-8 pt-8 pb-8">

              {/* Header */}
              <div className="mb-8">
                {/* Mobile : logo */}
                <div className="flex items-center gap-2.5 mb-6 lg:hidden">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-primary">
                      <path d="M5.5 14.5l2-5A1.5 1.5 0 019 8.5h6a1.5 1.5 0 011.5 1l2 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <path d="M3 14.5h18v3.5a1 1 0 01-1 1H4a1 1 0 01-1-1v-3.5z" fill="currentColor" fillOpacity=".15" stroke="currentColor" strokeWidth="1.4"/>
                      <circle cx="7.5" cy="18.5" r="1.4" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="16.5" cy="18.5" r="1.4" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-sm text-foreground">Auto-École Manager</span>
                </div>

                <h1 className="text-[22px] font-bold text-[#0f172a] dark:text-white tracking-tight mb-1.5">
                  Bon retour
                </h1>
                <p className="text-[13.5px] text-[#64748b] dark:text-white/50">
                  Connectez-vous à votre espace de gestion
                </p>
              </div>

              {/* Erreur */}
              {error === "AccountDisabled" && (
                <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Compte désactivé. Contactez l&apos;administrateur.</span>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.6px]">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#cbd5e1]" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@autoecole.ma"
                      {...register("email")}
                      className="
                        w-full h-[46px] pl-10 pr-4
                        rounded-xl
                        border-[1.5px] border-[#e2e8f4] dark:border-white/10
                        bg-[#f8fafc] dark:bg-white/5
                        text-[#0f172a] dark:text-white text-sm
                        placeholder:text-[#c1cad8] dark:placeholder:text-white/20
                        transition-all duration-150
                        focus:outline-none
                        focus:border-[#3b6cf4] dark:focus:border-[#3b6cf4]
                        focus:bg-white dark:focus:bg-white/8
                        focus:ring-4 focus:ring-[#3b6cf4]/10
                      "
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />{errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.6px]">
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      className="text-[12px] text-[#3b6cf4] hover:text-[#2554c8] font-medium transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#cbd5e1]" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="
                        w-full h-[46px] pl-10 pr-11
                        rounded-xl
                        border-[1.5px] border-[#e2e8f4] dark:border-white/10
                        bg-[#f8fafc] dark:bg-white/5
                        text-[#0f172a] dark:text-white text-sm
                        placeholder:text-[#c1cad8] dark:placeholder:text-white/20
                        transition-all duration-150
                        focus:outline-none
                        focus:border-[#3b6cf4] dark:focus:border-[#3b6cf4]
                        focus:bg-white dark:focus:bg-white/8
                        focus:ring-4 focus:ring-[#3b6cf4]/10
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c1cad8] hover:text-[#94a3b8] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />{errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.985 }}
                  className="
                    w-full h-[48px] mt-1
                    rounded-xl
                    bg-[#1e40af] hover:bg-[#1d3ca8]
                    text-white font-semibold text-[14px]
                    flex items-center justify-center gap-2
                    transition-colors duration-150
                    disabled:opacity-60 disabled:cursor-not-allowed
                    shadow-[0_4px_14px_-2px_rgba(30,64,175,0.45)]
                  "
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Connexion en cours...</>
                  ) : (
                    <><ArrowRight className="w-4 h-4" />Se connecter</>
                  )}
                </motion.button>
              </form>

              {/* Séparateur démo */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#e8edf5] dark:bg-white/8" />
                <span className="text-[11px] text-[#c1cad8] dark:text-white/25 font-medium uppercase tracking-[0.5px] whitespace-nowrap">
                  Comptes de démonstration
                </span>
                <div className="flex-1 h-px bg-[#e8edf5] dark:bg-white/8" />
              </div>

              {/* Boutons démo */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { role: "Administrateur", email: "admin@autoecole.ma", password: "Admin@2024", color: "#1e40af" },
                  { role: "Secrétaire", email: "secretaire@autoecole.ma", password: "Secret@2024", color: "#7c3aed" },
                ].map(({ role, email, password, color }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      (document.getElementById("email") as HTMLInputElement).value = email;
                      (document.getElementById("password") as HTMLInputElement).value = password;
                    }}
                    className="
                      h-[40px] rounded-xl
                      border-[1.5px] border-[#e8edf5] dark:border-white/10
                      bg-white/60 dark:bg-white/4
                      hover:border-[#c7d5f8] hover:bg-[#f0f4ff] dark:hover:bg-white/8
                      text-[12.5px] text-[#475569] dark:text-white/50
                      hover:text-[#1e40af] dark:hover:text-white
                      flex items-center justify-center gap-2
                      font-medium transition-all duration-150
                    "
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer card */}
            <div className="px-8 py-4 border-t border-[#f1f5f9] dark:border-white/6 bg-[#fafbfe]/80 dark:bg-white/[0.02]">
              <p className="text-center text-[11px] text-[#c1cad8] dark:text-white/20">
                © {new Date().getFullYear()} Auto-École Manager — Tous droits réservés
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}