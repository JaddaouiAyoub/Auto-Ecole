import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "SECRETARY";
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "SECRETARY";
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "SECRETARY";
    isActive: boolean;
  }
}
