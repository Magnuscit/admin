"use client";

import { useState } from "react";
import { useEffect } from "react";
import { EVENT, EventsInDay, infoType } from "@/libs/types";
import CartPass from "./CartPass";
import AddEventCard from "./AddEventCard";
import { IconSearch } from "@tabler/icons-react";
import Button from "./Button";
import Input from "./Input";
import { API_URL, PARSE } from "@/libs/utils";
import { useAuth, useCart, useFlow } from "@/store";
import axios from "axios";
import { toast } from "react-toastify";

const getDayPrice = (day: EventsInDay) => {
  if (day.PRO.length === 1 && day.WK.length === 2) return 850;
  if (day.PRO.length === 1 && day.WK.length === 1) return 700;
  if (day.PRO.length === 1 && day.WK.length === 0) return 350;
  if (day.PRO.length === 0 && day.WK.length === 2) return 500;
  if (day.PRO.length === 0 && day.WK.length === 1) return 350;
  if (day.PRO.length === 0 && day.WK.length === 0 && day.GEN.length !== 0)
    return 150;
  return 0;
};

export default function Cart({ user_email }: { user_email: string }) {
  let sum = 0;

  const setState = useFlow((state) => state.setState);

  const { resetCart, cart } = useCart((state) => state);
  const [events, setEvents] = useState<EVENT[]>([]);
  const [filtered, setFiltered] = useState<string>("");

  const auth = useAuth((state) => state.auth);
  const [isSubmiting, setSubmitting] = useState<boolean>(false);

  sum += getDayPrice(cart.DAY1);
  sum += getDayPrice(cart.DAY2);
  sum += getDayPrice(cart.DAY3);

  useEffect(() => {
    const fetchFolders = async () => {
      const res = await fetch("/api/events/folder");
      const data = (await res.json()) as {
        payload: { blob: { rawLines: Array<string> } };
      };

      const eventsData = PARSE(data.payload.blob.rawLines) as Record<
        string,
        infoType
      >;

      let EventArray: EVENT[] = [];
      for (const [key, value] of Object.entries(eventsData)) {
        const _day =
          value.date === "29/02/2024"
            ? "DAY1"
            : value.date === "01/03/2024"
              ? "DAY2"
              : "DAY3";

        const _category =
          key === "KLIVE" ? "PRO" : value.type === "WORKSHOP" ? "WK" : "GEN";

        EventArray.push({
          id: key,
          title: value.name,
          day: _day,
          category: _category,
        });
      }

      setEvents(EventArray);
    };
    fetchFolders();
  }, []);

  const confirmBooking = async () => {
    try {
      setSubmitting(true);
      let events_id = [
        ...cart.codes.DAY1,
        ...cart.codes.DAY2,
        ...cart.codes.DAY3,
      ];

      await axios.put(
        `${API_URL}/admin/update-cart`,
        { user_email, events_id },
        {
          headers: { authorization: `Bearer ${auth}` },
        },
      );
      toast.success("Updated users cart !");

      await axios.put(
        `${API_URL}/admin/pay-event`,
        { user_email },
        {
          headers: { authorization: `Bearer ${auth}` },
        },
      );
      toast.success("User marked as paid");

      await axios.post(
        `${API_URL}/admin/pay-event`,
        { email: user_email, type: "General" },
        {
          headers: { authorization: `Bearer ${auth}` },
        },
      );
      toast.success("Email is sent sucessfully ! ");

      resetCart();
      setState("participant-type");
    } catch (err) {
      toast.error("There was an error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col space-y-4 w-full lg:space-y-0 lg:space-x-4 lg:flex-row">
      <section className="bg-accentWhite w-full h-[500px] overflow-y-auto rounded-2xl p-4 space-y-4">
        <h1 className="text-3xl font-bold font-mono">
          User Cart{" "}
          <span
            className="text-lg text-red-400 hover:text-red-500 cursor-pointer"
            onClick={() => resetCart()}
          >
            Reset
          </span>
        </h1>
        <section className="flex flex-col gap-2">
          <CartPass day="DAY1" event={cart.DAY1} />
          <CartPass day="DAY2" event={cart.DAY2} />
          <CartPass day="DAY3" event={cart.DAY3} />
        </section>
        <h1 className="bg-accentWhite border-4 border-accentGrey text-accentGrey text-4xl font-bold text-right rounded-lg p-6">
          Total ₹{sum}
        </h1>
        <Button disabled={isSubmiting} onClick={confirmBooking}>
          {!isSubmiting ? "Confirm Booking" : "Submiting"}
        </Button>
      </section>

      <section className="h-[500px] w-full bg-accentWhite rounded-2xl p-4 overflow-y-auto space-y-4">
        <h1 className="text-3xl font-bold font-mono">Available Events</h1>
        <section className="flex space-x-2">
          <Input
            onChange={(e) => {
              setFiltered(e.target.value);
            }}
            type="text"
            placeholder="Search"
          />
          <Button>
            <IconSearch />
          </Button>
        </section>
        <section className="flex flex-col gap-2">
          {events
            .filter((val) => {
              return filtered.toLowerCase() === ""
                ? val
                : val.title.toLowerCase().includes(filtered);
            })
            .map((val) => (
              <AddEventCard
                key={val.id}
                category={val.category}
                title={val.title}
                id={val.id}
                day={val.day}
              />
            ))}
        </section>
      </section>
    </section>
  );
}
