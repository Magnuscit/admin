import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Cart, CartState } from "./libs/types";

export const initData: Cart = {
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

export const useCart = create<CartState>((set) => ({
  cart: initData,

  replaceCart: (newCart) => {
    set((state) => {
      return { ...state, cart: newCart };
    });
  },

  addEvent: (event) => {
    set((state) => {
      const newCart = state.cart;

      if (newCart.codes[event.day].includes(event.id)) return {};

      newCart[event.day][event.category].push(event);
      newCart.codes[event.day].push(event.id);

      return { cart: newCart };
    });
  },

  removePass: (day) => {
    set((state) => {
      const newCart = state.cart;

      newCart[day] = {
        WK: [],
        GEN: [],
        PRO: [],
      };
      newCart.codes[day] = [];

      return { cart: newCart };
    });
  },

  removeEvent: (code, day, category) => {
    set((state) => {
      const newCart = state.cart;

      newCart[day][category] = [
        ...newCart[day][category].filter((obj) => obj.id !== code),
      ];
      newCart.codes[day] = [...newCart.codes[day].filter((i) => i !== code)];

      return { cart: newCart };
    });
  },
  resetCart: () => {
    set(() => {
      const initDat = {
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
      return { cart: initDat };
    });
  },
}));

interface AuthState {
  auth: string | null;
  uname: string | null;
  setAcessToken: (accesstoken: string) => void;
  setName: (name: string) => void;
  removeToken: () => void;
}

const initUser = null;

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      auth: initUser,
      uname: initUser,
      setAcessToken: (accesstoken) => {
        set((state) => ({
          ...state,
          auth: accesstoken,
        }));
      },

      setName: (name) => {
        set((state) => ({ ...state, uname: name }));
      },

      removeToken: () => {
        set(() => ({ uname: null, auth: null }));
      },
    }),

    {
      name: "user",

      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

type TState = "participant-type" | "registered" | "unregistered";
type FlowState = { state: TState; setState: (state: TState) => void };
export const useFlow = create<FlowState>((set) => ({
  state: "participant-type",
  setState: (newState) => {
    set((state) => ({ state: newState }));
  },
}));
