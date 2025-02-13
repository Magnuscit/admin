"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/libs/utils";
import { toast } from "react-toastify";
import MagnusCart from "./MagnusCart";
import { useParticipants, usePhaseStore } from "@/store";

export default function UnregisterPage() {
  const { resetState, setUserDetails } = useParticipants();
  // const [currentPhase, setCurrentPhase] = useState<
  //   "userdetails" | "eventselection"
  // >("userdetails");
  const { currentPhase, setCurrentPhase } = usePhaseStore();

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

  type RegisteredFormType = z.infer<typeof RegisterForm>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisteredFormType>({
    resolver: zodResolver(RegisterForm),
  });

  const onSubmit = async (user: RegisteredFormType) => {
    try {
      setCurrentPhase("eventselection");
      setUserDetails(user);
      toast.success("User Created sucessfully ! ! !");
    } catch (err) {
      toast.error("There is an ERROR, may be username already exist");
    }
  };

  useEffect(() => {
    if (errors.college) toast.error(errors.college.message);
    if (errors.name) toast.error(errors.name.message);
    if (errors.email) toast.error(errors.email.message);
    if (errors.mobile) toast.error(errors.mobile.message);
  }, [errors]);

  useEffect(() => {
    resetState();
    reset();
  }, []);

  return (
    <section className="flex flex-col items-center space-y-4 w-full">
      {currentPhase === "userdetails" && (
        <div className="w-full max-w-xl ">
          <span
            className="bg-white p-2 rounded-md cursor-pointer"
            onClick={() => reset()}
          >
            o
          </span>
        </div>
      )}
      {currentPhase === "eventselection" && (
        <div className="w-full max-w-xl ">
          <span
            className="bg-white p-2 rounded-md cursor-pointer"
            onClick={() => setCurrentPhase("userdetails")}
          >
            &lt;=
          </span>
        </div>
      )}
      {currentPhase === "userdetails" ? (
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
            {!isSubmitting ? "Next" : "Loading"}
          </Button>
        </form>
      ) : (
        <MagnusCart />
      )}
    </section>
  );
}
