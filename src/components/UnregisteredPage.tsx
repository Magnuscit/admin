"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import Cart from "./Cart";
import { useAuth, useCart } from "@/store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { API_URL, cn } from "@/libs/utils";
import { toast } from "react-toastify";

export default function UnregisterPage() {
  const [user, setUser] = useState<string | null>(null);

  const RegisterForm = z.object({
    name: z
      .string({ required_error: "Name feild is required" })
      .min(4, "Name should be atleast 4 characters")
      .max(15, "Name should be atmost 15 characters"),
    college: z
      .string({ required_error: "College feild is required" })
      .min(4, "College Name should be atleast 3 characters")
      .max(50, "Colege Name should be atmost 50 characters"),
    mobile: z
      .string({ required_error: "Mobile Number is required" })
      .length(10, "Invalid mobile number"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
  });

  const auth = useAuth((state) => state.auth);
  const resetCart = useCart((state) => state.resetCart);

  type RegisteredFormType = z.infer<typeof RegisterForm>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisteredFormType>({
    resolver: zodResolver(RegisterForm),
  });

  const onSubmit = async (user: RegisteredFormType) => {
    try {
      const res = await axios.post(
        `${API_URL}/admin/create-user`,
        {
          name: user.name,
          clg_name: user.college,
          phone_no: user.mobile,
          email: user.email,
        },
        {
          headers: { authorization: `Bearer ${auth}` },
        },
      );

      if (res.status === 200) setUser(user.email);
      toast.success("User Created sucessfully ! ! !");
    } catch (err) {
      toast.error("There is an ERROR, may be username already exist");
    }
    resetCart();
  };

  useEffect(() => {
    if (errors.college) toast.error(errors.college.message);
    if (errors.name) toast.error(errors.name.message);
    if (errors.email) toast.error(errors.email.message);
    if (errors.mobile) toast.error(errors.mobile.message);
  }, [errors]);

  useEffect(() => {
    resetCart();
  }, []);

  return (
    <section className="flex flex-col items-center space-y-4 w-full">
      {user !== null ? (
        <h1 className="text-accentWhite font-mono text-center">
          Displaying Cart of {user}
        </h1>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-center space-y-2"
        >
          <input
            {...register("email")}
            placeholder="Email"
            className={cn(
              "p-2 px-5 rounded-lg shadow-black bg-accentWhite w-full lg:max-w-xl text-accentBlack text-lg border-4 border-accentGrey focus:outline-none",
              errors.email && "border-4 border-red-500",
            )}
            type="text"
          />
          <input
            {...register("name")}
            placeholder="Name"
            className={cn(
              "p-2 px-5 rounded-lg shadow-black bg-accentWhite w-full lg:max-w-xl text-accentBlack text-lg border-4 border-accentGrey focus:outline-none",
              errors.name && "border-4 border-red-500",
            )}
            type="text"
          />
          <input
            {...register("mobile")}
            placeholder="Phone Number"
            className={cn(
              "p-2 px-5 rounded-lg shadow-black bg-accentWhite w-full lg:max-w-xl text-accentBlack text-lg border-4 border-accentGrey focus:outline-none",
              errors.mobile && "border-4 border-red-500",
            )}
            type="text"
          />
          <input
            {...register("college")}
            placeholder="Collage Name"
            className={cn(
              "p-2 px-5 rounded-lg shadow-black bg-accentWhite w-full lg:max-w-xl text-accentBlack text-lg border-4 border-accentGrey focus:outline-none",
              errors.college && "border-4 border-red-500",
            )}
            type="text"
          />
          <br />
          <Button type="submit" disabled={isSubmitting}>
            {!isSubmitting ? "Register" : "Loading"}
          </Button>
        </form>
      )}

      {user !== null && <Cart user_email={user} />}
    </section>
  );
}
