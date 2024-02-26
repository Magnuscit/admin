"use client";
import Button from "@/components/Button";
import { API_URL, cn } from "@/libs/utils";
import { AdminLogin, AdminType } from "@/libs/validators";
import { useAuth, useCart } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdminType>({
    resolver: zodResolver(AdminLogin),
  });

  const { setName, setAcessToken, auth } = useAuth((state) => state);
  const { resetCart } = useCart((state) => state);
  const router = useRouter();

  useEffect(() => {
    resetCart();
    if (auth) return router.push("/");
  }, []);

  const onSubmit = async (data: AdminType) => {
    try {
      const res = await axios.post(`${API_URL}/admin/login`, {
        ...data,
      });

      setAcessToken(res.data.body.token);
      setName(data.uname);

      router.push("/");

      reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="bg-accentBlack min-h-screen flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-4 bg-accentGrey w-full p-8 rounded-lg lg:max-w-sm"
      >
        <h1 className="text-3xl font-bold text-accentWhite">Login</h1>
        <input
          {...register("uname")}
          type="text"
          placeholder="username"
          className={cn(
            "p-2 w-full",
            errors.uname && "border-4 border-red-500",
          )}
        />
        <input
          {...register("password")}
          type="password"
          placeholder="password"
          className={cn(
            "p-2 w-full",
            errors.password && "border-4 border-red-500",
          )}
        />
        <Button type="submit" disabled={isSubmitting} varient="grey">
          Submit
        </Button>
      </form>
    </main>
  );
}
