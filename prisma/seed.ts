import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // ─── Settings ────────────────────────────────────────────────────────────────

  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        schoolName: "Auto-École Al Mokhtar",
        address: "123 Avenue Hassan II, Casablanca",
        phone: "0522-123456",
        email: "contact@autoecole-almokhtar.ma",
        currency: "MAD",
        currencySymbol: "DH",
        locale: "fr-MA",
      },
    });
    console.log("✅ Paramètres créés");
  }

  // ─── Admin User ───────────────────────────────────────────────────────────────

  const adminEmail = "admin@autoecole.ma";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin@2024", 12);
    await prisma.user.create({
      data: {
        name: "Administrateur",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        isActive: true,
      },
    });
    console.log("✅ Compte admin créé: admin@autoecole.ma / Admin@2024");
  }

  // ─── Secretary User ───────────────────────────────────────────────────────────

  const secretaryEmail = "secretaire@autoecole.ma";
  const existingSecretary = await prisma.user.findUnique({ where: { email: secretaryEmail } });

  if (!existingSecretary) {
    const passwordHash = await bcrypt.hash("Secret@2024", 12);
    await prisma.user.create({
      data: {
        name: "Fatima Zahra",
        email: secretaryEmail,
        passwordHash,
        role: "SECRETARY",
        isActive: true,
      },
    });
    console.log("✅ Compte secrétaire créé: secretaire@autoecole.ma / Secret@2024");
  }

  // ─── Demo Students ────────────────────────────────────────────────────────────

  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) throw new Error("Admin user not found");

  const studentsData = [
    {
      firstName: "Mohammed",
      lastName: "Alaoui",
      cin: "AB123456",
      phone: "0661234567",
      address: "15 Rue des Fleurs, Casablanca",
      email: "mohammed.alaoui@gmail.com",
      birthDate: new Date("1995-03-15"),
      licenseCategory: "B" as const,
      totalPrice: 4500,
      paidAmount: 4500,
      remainingAmount: 0,
      paymentPercentage: 100,
      status: "COMPLETED" as const,
    },
    {
      firstName: "Aicha",
      lastName: "Benali",
      cin: "CD789012",
      phone: "0672345678",
      address: "8 Boulevard Zerktouni, Rabat",
      email: "aicha.benali@gmail.com",
      birthDate: new Date("1998-07-22"),
      licenseCategory: "B" as const,
      totalPrice: 4500,
      paidAmount: 2500,
      remainingAmount: 2000,
      paymentPercentage: 55.56,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Youssef",
      lastName: "El Idrissi",
      cin: "EF345678",
      phone: "0683456789",
      address: "42 Avenue Mohamed V, Fès",
      licenseCategory: "A" as const,
      totalPrice: 3800,
      paidAmount: 1000,
      remainingAmount: 2800,
      paymentPercentage: 26.32,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Khadija",
      lastName: "Mansouri",
      cin: "GH901234",
      phone: "0694567890",
      address: "77 Rue Kettani, Marrakech",
      email: "khadija.m@gmail.com",
      birthDate: new Date("2000-11-30"),
      licenseCategory: "B" as const,
      totalPrice: 4500,
      paidAmount: 4500,
      remainingAmount: 0,
      paymentPercentage: 100,
      status: "COMPLETED" as const,
    },
    {
      firstName: "Omar",
      lastName: "Tazi",
      cin: "IJ567890",
      phone: "0615678901",
      address: "23 Rue Moulay Ali Cherif, Agadir",
      birthDate: new Date("1997-05-18"),
      licenseCategory: "C" as const,
      totalPrice: 6000,
      paidAmount: 3000,
      remainingAmount: 3000,
      paymentPercentage: 50,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Imane",
      lastName: "Chakir",
      cin: "KL123890",
      phone: "0626789012",
      address: "5 Résidence Al Fath, Salé",
      licenseCategory: "B" as const,
      totalPrice: 4500,
      paidAmount: 0,
      remainingAmount: 4500,
      paymentPercentage: 0,
      status: "SUSPENDED" as const,
    },
    {
      firstName: "Rachid",
      lastName: "Berrada",
      cin: "MN456012",
      phone: "0637890123",
      address: "11 Rue Ibn Batouta, Tanger",
      birthDate: new Date("1993-08-07"),
      licenseCategory: "D" as const,
      totalPrice: 7500,
      paidAmount: 5000,
      remainingAmount: 2500,
      paymentPercentage: 66.67,
      status: "ACTIVE" as const,
    },
    {
      firstName: "Nadia",
      lastName: "El Fassi",
      cin: "OP789234",
      phone: "0648901234",
      address: "30 Avenue Allal Ben Abdellah, Meknès",
      email: "nadia.elfassi@email.com",
      birthDate: new Date("2001-02-14"),
      licenseCategory: "B" as const,
      totalPrice: 4500,
      paidAmount: 1500,
      remainingAmount: 3000,
      paymentPercentage: 33.33,
      status: "ACTIVE" as const,
    },
  ];

  for (const studentData of studentsData) {
    const existing = await prisma.student.findUnique({ where: { cin: studentData.cin } });
    if (!existing) {
      const student = await prisma.student.create({ data: studentData });

      // Create payments for students who have paid
      if (studentData.paidAmount > 0) {
        const paymentCount = studentData.paidAmount === studentData.totalPrice ? 2 : 1;
        const amountPerPayment = studentData.paidAmount / paymentCount;

        for (let i = 0; i < paymentCount; i++) {
          const date = new Date();
          date.setMonth(date.getMonth() - (paymentCount - i));
          await prisma.payment.create({
            data: {
              studentId: student.id,
              amount: amountPerPayment,
              paymentDate: date,
              paymentMethod: i === 0 ? "CASH" : "BANK_TRANSFER",
              description: i === 0 ? "Acompte à l'inscription" : "Solde",
              receiptNumber: `REC-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}-${i}`,
              createdById: adminUser.id,
            },
          });
        }
      }

      // Add a demo note
      await prisma.note.create({
        data: {
          studentId: student.id,
          content: `Dossier créé. ${studentData.status === "SUSPENDED" ? "En attente de régularisation." : "Progression satisfaisante."}`,
          createdById: adminUser.id,
        },
      });
    }
  }

  console.log("✅ 8 élèves de démonstration créés avec paiements");

  // ─── Audit Log ────────────────────────────────────────────────────────────────

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "CREATE",
      entity: "System",
      entityId: "seed",
      newValues: { message: "Base de données initialisée via seed" },
    },
  });

  console.log("✅ Journal d'audit initialisé");
  console.log("\n🎉 Seed terminé avec succès!\n");
  console.log("═══════════════════════════════════════════");
  console.log("  Comptes de connexion:");
  console.log("  Admin     → admin@autoecole.ma / Admin@2024");
  console.log("  Secrétaire→ secretaire@autoecole.ma / Secret@2024");
  console.log("═══════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
