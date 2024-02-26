export const REPO_OWNER = "cittakshashila";
export const REPO_NAME = "EVENTS-DATA-24";

export type INFO_URL =
  `https://github.com/cittakshashila/EVENTS-DATA-24/blob/master/${string}/info.json`;

type Type =
  | "All"
  | "TECHNICAL"
  | "NON-TECHNICAL"
  | "WORKSHOP"
  | "PRO SHOW"
  | "ONLINE EVENT";

export type infoType = { name: string; type: Type; date: string };

export type EVENT = {
  id: string;
  title: string;
  day: "DAY1" | "DAY2" | "DAY3";
  category: "WK" | "GEN" | "PRO";
};

/// INTERFACES FOR CART
export interface EventsInDay {
  WK: EVENT[];
  GEN: EVENT[];
  PRO: EVENT[];
}

export interface Cart {
  DAY1: EventsInDay;
  DAY2: EventsInDay;
  DAY3: EventsInDay;
  codes: {
    DAY1: string[];
    DAY2: string[];
    DAY3: string[];
  };
}

// INTERFACE FOR USER
export interface User {
  name: string;
  email: string;
  picture: string;
  access_token: string;
  verified: boolean;
}

export interface CartState {
  cart: Cart;

  resetCart: () => void;
  replaceCart: (cart: Cart) => void;
  addEvent: (prop: EVENT) => void;
  removePass: (day: "DAY1" | "DAY2" | "DAY3") => void;
  removeEvent: (
    code: string,
    day: "DAY1" | "DAY2" | "DAY3",
    category: "WK" | "GEN" | "PRO",
  ) => void;
}

export interface ReceivedCart {
  DAY1: { event_id: string; name: string; fee: number }[];
  DAY2: { event_id: string; name: string; fee: number }[];
  DAY3: { event_id: string; name: string; fee: number }[];
}

// INTERFACE FOR USER
export interface User {
  name: string;
  email: string;
  picture: string;
  access_token: string;
}

export type MEDIA_URL =
  `https://raw.githubusercontent.com/cittakshashila/EVENTS-DATA-24/master/events/${string}/assets/${string}.png`;

export type FOLDER_TYPE = {
  name: string;
  path: string;
  contentType: string;
};
