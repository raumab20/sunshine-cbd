import LoginForm from "@/components/LoginForm";
import LoginGithub from "@/components/LoginGithub";
import Link from "next/link";
import React from "react";

const SignIn = () => {
  return (
    <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Sign in</h1>
        <LoginForm />
        <p className="mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="underline">
            Click here to register
          </Link>
        </p>
        <LoginGithub />
      </section>
    </div>
  );
};

export default SignIn;
