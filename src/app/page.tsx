"use client";

import Button from "@/components/Button";
import RegisterPage from "@/components/RegisteredPage";
import UnregisterPage from "@/components/UnregisteredPage";
import { useAuth, useCart } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TState = "participant-type" | "registered" | "unregistered";

export default function Home() {
  const [state, setState] = useState<TState>("participant-type");
  const { auth, uname, removeToken } = useAuth((state) => state);
  const { resetCart } = useCart((state) => state);
  const router = useRouter();

  useEffect(() => {
    resetCart();
    if (!auth) return router.push("/login");
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-accentBlack items-center justify-center p-8 lg:p-24">
      <nav className="flex items-center justify-between px-10 my-2 w-full h-16 fixed top-0 text-white font-mono ">
        <h1>
          you are signed in as: <strong>{uname}</strong>
        </h1>
        <Button
          onClick={() => {
            router.push("/login");
            removeToken();
          }}
          varient="grey"
        >
          Logout
        </Button>
      </nav>

      <h1 className="text-accentWhite mb-8 text-2xl font-mono text-center">
        {state === "participant-type" && "Is The Participant Registered ?"}
        {state === "registered" && "Enter Participant Email"}
        {state === "unregistered" && "Enter Participant Details"}
      </h1>

      {state === "participant-type" && (
        <section className="flex gap-4">
          <Button onClick={() => setState("registered")}>Registered</Button>
          <Button onClick={() => setState("unregistered")}>Unregistered</Button>
        </section>
      )}

      {state === "registered" && <RegisterPage />}
      {state === "unregistered" && <UnregisterPage />}
    </main>
  );
}
