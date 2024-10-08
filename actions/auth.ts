"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { saltAndHashPassword } from "@/utils/helper";

const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: "/" });
  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

export const loginWithCreds = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Bitte E-Mail und Passwort eingeben." };
  }

  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result || result.error) {
      return { error: "Ungültige Anmeldedaten." };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut." };
  }
};

export const registerWithCreds = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const username = formData.get("username") as string;

  if (!email || !password || !confirmPassword) {
    return { error: "Bitte alle Felder ausfüllen." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  // **E-Mail-Format validieren**
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Bitte eine gültige E-Mail-Adresse eingeben." };
  }

  // **Passwortstärke überprüfen**
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return {
      error:
        "Das Passwort muss mindestens 8 Zeichen lang sein und Buchstaben, Zahlen und Sonderzeichen enthalten.",
    };
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: "Ein Benutzer mit dieser E-Mail existiert bereits." };
    }

    const hashedPassword = await saltAndHashPassword(password);

    const newUser = await db.user.create({
      data: {
        email,
        name: username || null,
        hashedPassword,
      },
    });

    console.log("Neuer Benutzer erstellt:", newUser);

    return { success: true };
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    return {
      error: "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    };
  }
};
