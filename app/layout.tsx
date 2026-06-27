import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProviderWrapper } from "@/providers/session-provider";
import { auth } from "@/lib/auth";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "Auto-École Manager — Gestion d'Auto-École",
    template: "%s | Auto-École Manager",
  },
  description:
    "Système de gestion complet pour auto-école. Gérez vos Candidats, paiements, et statistiques en toute simplicité.",
  keywords: ["auto-école", "gestion", "paiements", "Candidats", "maroc", "permis de conduire"],
  authors: [{ name: "Auto-École Manager" }],
  creator: "Auto-École Manager",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="fr"
      className={cn(GeistSans.variable, GeistMono.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProviderWrapper session={session}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange={false}
            >
              {children}
              <Toaster
                position="bottom-right"
                richColors
                closeButton
                duration={4000}
                toastOptions={{
                  classNames: {
                    toast: "font-sans",
                  },
                }}
              />
            </ThemeProvider>
          </QueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
