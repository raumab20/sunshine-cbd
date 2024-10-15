import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials: Partial<Record<"email" | "password", unknown>>
      ) => {
        try {
          if (!credentials?.email || !credentials.password) {
            throw new Error("Bitte E-Mail und Passwort eingeben.");
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.hashedPassword) {
            throw new Error("Ungültige Anmeldedaten.");
          }

          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (!isMatch) {
            throw new Error("Ungültige Anmeldedaten.");
          }

          return {
            ...user,
            role: user.role || "USER",
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message || "Interner Serverfehler.");
          } else {
            throw new Error("Interner Serverfehler.");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
});
