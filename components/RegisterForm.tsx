"use client";
import React, { useState } from "react";
import { registerWithCreds } from "@/actions/auth";
import { useRouter } from "next/navigation";
import RegisterButton from "@/components/RegisterButton";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await registerWithCreds(formData);

      if (result?.error) {
        setLoading(false);
        setError(result.error);
      } else {
        router.push("/sign-in");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("An unexpected error occurred.");
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
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            className="mt-1 w-full px-4 p-2 h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium mt-2">{error}</p>
        )}

        <div className="mt-4">
          <RegisterButton />
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
