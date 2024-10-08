"use client";
import React, { useState } from "react";
import { registerWithCreds } from "@/actions/auth";
import { useRouter } from "next/navigation";
import RegisterButton from "@/components/RegisterButton";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // **Clientseitige Validierung**
    if (!email || !password || !confirmPassword) {
      setError("Bitte alle Felder ausfüllen.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // **Passwortstärke überprüfen**
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Das Passwort muss mindestens 8 Zeichen lang sein und Buchstaben, Zahlen und Sonderzeichen enthalten."
      );
      setLoading(false);
      return;
    }

    try {
      const result = await registerWithCreds(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        // **Erfolgreiche Registrierung, Weiterleitung**
        router.push("/sign-in");
      }
    } catch (error) {
      console.error(error);
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Passwort
          </label>
          <input
            type="password"
            placeholder="Passwort"
            name="password"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Passwort bestätigen
          </label>
          <input
            type="password"
            placeholder="Passwort bestätigen"
            name="confirmPassword"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium mt-2">{error}</p>
        )}

        <div className="mt-4">
          <RegisterButton loading={loading} />
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
