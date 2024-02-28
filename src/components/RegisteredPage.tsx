"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API_URL, cn } from "@/libs/utils";
import axios from "axios";
import { initData, useAuth, useCart, useFlow } from "@/store";
import { Cart, EVENT, ReceivedCart } from "@/libs/types";
import CartComponent from "./Cart";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [user, setUser] = useState<string | null>(null);

  const RegisterForm = z.object({
    user_email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email"),
  });
  const auth = useAuth((state) => state.auth);
  const replaceCart = useCart((state) => state.replaceCart);
  const { setState } = useFlow((state) => state);

  type RegisteredFormType = z.infer<typeof RegisterForm>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisteredFormType>({
    resolver: zodResolver(RegisterForm),
  });

  const onSubmit = async (data: RegisteredFormType) => {
    try {
      const res = await axios.post(
        `${API_URL}/admin/get-cart`,
        { user_email: data.user_email },
        {
          headers: { Authorization: `Bearer ${auth}` },
        },
      );

      if (res.status === 400) {
        toast.warn("user did't register");
        return setState("participant-type");
      }

      const cart: ReceivedCart = res.data.body.data;
      if (Object.keys(cart).length === 0) {
        toast.warn("User didn't book any events ! ! !");
      }

      let newCart: Cart = {
        DAY1: {
          WK: [],
          GEN: [],
          PRO: [],
        },
        DAY2: {
          WK: [],
          GEN: [],
          PRO: [],
        },
        DAY3: {
          WK: [],
          GEN: [],
          PRO: [],
        },
        codes: {
          DAY1: [],
          DAY2: [],
          DAY3: [],
        },
      };

      if (cart["DAY1"])
        for (let event of cart["DAY1"]) {
          const _category =
            event.event_id === "KLIVE"
              ? "PRO"
              : event.fee === 200
                ? "WK"
                : "GEN";
          const newObj: EVENT = {
            id: event.event_id,
            title: event.name,
            day: "DAY1",
            category: _category,
          };
          if (!newCart.codes.DAY1.includes(event.event_id)) {
            newCart.DAY1[_category].push(newObj);
            newCart["codes"].DAY1.push(event.event_id);
          }
        }

      if (cart["DAY2"])
        for (let event of cart["DAY2"]) {
          const _category =
            event.event_id === "KLIVE"
              ? "PRO"
              : event.fee === 200
                ? "WK"
                : "GEN";
          const newObj: EVENT = {
            id: event.event_id,
            title: event.name,
            day: "DAY2",
            category: _category,
          };

          if (!newCart.codes.DAY2.includes(event.event_id)) {
            newCart.DAY2[_category].push(newObj);
            newCart["codes"].DAY2.push(event.event_id);
          }
        }

      if (cart["DAY3"])
        for (let event of cart["DAY3"]) {
          const _category =
            event.event_id === "KLIVE"
              ? "PRO"
              : event.fee === 200
                ? "WK"
                : "GEN";
          const newObj: EVENT = {
            id: event.event_id,
            title: event.name,
            day: "DAY3",
            category: _category,
          };

          if (!newCart.codes.DAY3.includes(event.event_id)) {
            newCart.DAY3[_category].push(newObj);
            newCart["codes"].DAY3.push(event.event_id);
          }
        }

      setUser(data.user_email);
      toast.success("Fetched Sucessfully");
      replaceCart(newCart);
    } catch (err) {
      toast.error("There was an error fetching data");
    }
  };

  useEffect(() => {
    if (errors.user_email) toast.error(errors.user_email.message);
  }, [errors]);

  return (
    <section className="flex flex-col space-y-4 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:flex lg:space-x-4 lg:justify-center space-y-2 text-center lg:space-y-0"
      >
        <input
          {...register("user_email")}
          className={cn(
            "p-2 px-5 rounded-lg shadow-black bg-accentWhite w-full lg:max-w-xl text-accentBlack text-lg border-4 border-accentGrey focus:outline-none",
            errors.user_email && "border-4 border-red-500",
          )}
          placeholder="Email Here"
          disabled={user ? true : false}
          type="text"
        />
        {!user && (
          <Button disabled={isSubmitting} type="submit">
            {!isSubmitting ? "Search" : "Loading"}
          </Button>
        )}
      </form>

      {user !== null && <CartComponent user_email={user} />}
    </section>
  );
}
