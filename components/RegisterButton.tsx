"use client";
import React from "react";

interface RegisterButtonProps {
  loading: boolean;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ loading }) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className={`${
        loading ? "bg-gray-600" : "bg-blue-600"
      } rounded-md w-full px-12 py-3 text-sm font-medium text-white`}
    >
      {loading ? "Registriere..." : "Registrieren"}
    </button>
  );
};

export default RegisterButton;
