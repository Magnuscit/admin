import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/*++++++ADMINS++++++++++++++++++++++++++ */
interface AdminStore {
  admin: string;
  setAdmin: (admin: string) => void;
}

const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: "",
      setAdmin: (admin) => set({ admin }),
    }),
    { name: "admin-session", storage: createJSONStorage(() => sessionStorage) },
  ),
);

/*++++++PARTICIPANTS++++++++++++++++++++++++++ */
interface UserDetails {
  email: string;
  name: string;
  college: string;
  mobile: string;
}

interface Store {
  email: string;
  name: string;
  college: string;
  mobile: string;
  events: string[];

  setUserDetails: (userDetails: UserDetails) => void;
  addEvent: (event: string) => void;
  removeEvent: (event: string) => void;
  resetState: () => void;
}

const useParticipants = create<Store>()(
  persist(
    (set) => ({
      email: "",
      name: "",
      college: "",
      mobile: "",
      events: [],

      setUserDetails: (userDetails) => set({ ...userDetails }),

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),

      resetState: () =>
        set({
          email: "",
          name: "",
          college: "",
          mobile: "",
          events: [],
        }),

      removeEvent: (event) =>
        set((state) => ({
          events: state.events.filter((e) => e !== event),
        })),
    }),
    { name: "user-session", storage: createJSONStorage(() => sessionStorage) },
  ),
);



/*++++++PHASE++++++++++++++++++++++++++ */
type Phase = "userdetails" | "eventselection";
interface PhaseStore {
  currentPhase: Phase;
  setCurrentPhase: (phase: Phase) => void;
}

const usePhaseStore = create<PhaseStore>((set) => ({
  currentPhase: "userdetails", 
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
}));

export { useParticipants, useAdminStore, usePhaseStore };
