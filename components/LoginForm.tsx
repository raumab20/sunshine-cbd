"use client";
import React, { useState } from "react";
import AuthButton from "@/components/AuthButton";
import { loginWithCreds } from "@/actions/auth";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Hinzufügen des loading-Zustands
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Laden beginnt

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // **Clientseitige Validierung**
    if (!email || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      setLoading(false); // Laden endet bei Fehler
      return;
    }

    try {
      const result = await loginWithCreds(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        // **Erfolgreiche Anmeldung, Seite neu laden**
        window.location.href = "/"; // Vollständiger Reload
      }
    } catch (error) {
      console.error(error);
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false); // Laden endet
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
            id="Email"
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
            id="password"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium mt-2">{error}</p>
        )}

        <div className="mt-4">
          <AuthButton loading={loading} /> {/* loading-Prop übergeben */}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
