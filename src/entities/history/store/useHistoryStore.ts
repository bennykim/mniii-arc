import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  realtimeHistory: UIHistory[];
  readState: { [id: string]: boolean };
};

type Actions = {
  addRealtimeHistory: (histories: UIHistory[]) => void;
  clearRealtimeHistory: () => void;
  setHistoryRead: (id: string) => void;
};

type Store = State & Actions;

const createHistoryStore = () => {
  const store = (set: (fn: (state: State) => State) => void): Store => ({
    realtimeHistory: [],
    readState: {},

    addRealtimeHistory: (histories: UIHistory[]) =>
      set((state) => ({
        ...state,
        realtimeHistory: [...state.realtimeHistory, ...histories],
      })),

    clearRealtimeHistory: () =>
      set((state) => ({
        ...state,
        realtimeHistory: [],
      })),

    setHistoryRead: (id: string) =>
      set((state) => ({
        ...state,
        readState: { ...state.readState, [id]: true },
      })),
  });

  return create<Store>()(devtools(store));
};

export const useHistoryStore = createHistoryStore();
