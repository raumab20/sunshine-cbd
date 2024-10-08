"use client";
import React from "react";

interface AuthButtonProps {
  loading: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ loading }) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className={`${
        loading ? "bg-gray-600" : "bg-blue-600"
      } rounded-md w-full px-12 py-3 text-sm font-medium text-white`}
    >
      {loading ? "Lade..." : "Anmelden"}
    </button>
  );
};

export default AuthButton;
