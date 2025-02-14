"use client";

import { useParticipants, usePhaseStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import axios from "axios";
import { API_URL } from "@/libs/utils";
import { toast } from "react-toastify";

type TData = {
  name: string;
  code: string;
  price: number;
};

export default function MagnusCart() {
  const [data, setData] = useState<TData[]>();
  const {
    name,
    college,
    mobile,
    email,
    events,
    addEvent,
    removeEvent,
    resetState,
  } = useParticipants();
  const pricemap = useRef<{ [code: string]: number }>();
  const { currentPhase, setCurrentPhase } = usePhaseStore();

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch("/api/events/folder");
      const data: { [code: string]: { price: number; name: string } } =
        await res.json();
      const alreadyRegisteredEvents = await axios.post(
        `${API_URL}/user-events`,
        {
          email,
        },
      );

      const registeredCodesSet = new Set(alreadyRegisteredEvents.data.events);
      let tmp: TData[] = [];
      let tmpPricemap: { [code: string]: number } = {};
      for (let i in data) {
        if (!registeredCodesSet.has(i)) {
          tmp.push({
            code: i,
            name: data[i].name,
            price: data[i].price,
          });
          tmpPricemap[i] = data[i].price;
        }
      }

      setData(tmp);
      pricemap.current = tmpPricemap;
    };
    fetchContent();
  }, []);

  function calcSum() {
    let sm: number = 0;
    for (let i of events) {
      if (pricemap.current) sm += pricemap.current[i];
      else sm += 0;
    }

    return sm;
  }

  const onSubmit = async () => {
    try {
      await axios.post(`${API_URL}/on-desk-registration`, {
        phone: mobile,
        college,
        name,
        email,
        events,
      });

      toast.success("registered");
      resetState();
      setCurrentPhase("userdetails");
    } catch {
      toast.warn("user did't register");
    }
  };

  return (
    <>
      <section className="max-w-xl w-full h-96 bg-white overflow-scroll flex flex-col space-y-1 p-3 font-mono">
        {data?.map((v, i) => (
          <div
            key={i}
            className="bg-gray-800 text-white py-3 px-2 flex justify-between cursor-pointer"
            onClick={() => {
              if (!events.includes(v.code)) addEvent(v.code);
              else removeEvent(v.code);
            }}
          >
            <h1 className="w-full"> {v.name} </h1>
            <h1 className="w-full text-right">{v.price}</h1>
            <h1 className="w-full text-right">
              {events.includes(v.code) ? "[x]" : "[ ]"}
            </h1>
          </div>
        ))}
      </section>
      <section className="max-w-xl w-full  text-white flex justify-between px-5 font-mono">
        <h1 className="">Total: {calcSum()}</h1>
        <Button onClick={onSubmit}>Submit</Button>
      </section>
    </>
  );
}
