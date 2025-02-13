"use client";

import Button from "@/components/Button";
import UnregisterPage from "@/components/UnregisteredPage";
import { useAdminStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const { admin } = useAdminStore();

  useEffect(() => {
    if (!admin) return router.push("/login");
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-accentBlack items-center justify-center p-8 lg:p-24">
      <nav className="flex items-center justify-between px-10 my-2 w-full h-16 fixed top-0 text-white font-mono ">
        <h1>
          you are signed in as: <strong>{admin}</strong>
        </h1>
        <section className="space-x-3">
          <Button
            onClick={() => {
              router.push("/login");
            }}
            varient="grey"
          >
            Logout
          </Button>
        </section>
      </nav>

      <h1 className="text-accentWhite mb-8 text-2xl font-mono text-center">
        Enter Participant Details
      </h1>

      <UnregisterPage />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="dark"
      />
    </main>
  );
}
