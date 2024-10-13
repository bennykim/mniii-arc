import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  realtimeHistory: UIHistory[];
};

type Actions = {
  addRealtimeHistory: (histories: UIHistory[]) => void;
  clearRealtimeHistory: () => void;
};

type Store = State & Actions;

const createHistoryStore = () => {
  const store = (set: (fn: (state: State) => State) => void): Store => ({
    realtimeHistory: [],

    addRealtimeHistory: (histories: UIHistory[]) =>
      set((state) => ({
        realtimeHistory: [...state.realtimeHistory, ...histories],
      })),

    clearRealtimeHistory: () =>
      set((state) => ({
        ...state,
        realtimeHistory: [],
      })),
  });

  return create<Store>()(devtools(store));
};

export const useHistoryStore = createHistoryStore();
