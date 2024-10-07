import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";
import React from "react";

const Register = () => {
  return (
    <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Register</h1>
        <RegisterForm />
        <p className="mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Click here to sign in
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Register;
