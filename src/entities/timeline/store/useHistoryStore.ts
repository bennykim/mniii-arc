import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  selectedHistory: UIHistory | null;
};

type Actions = {
  selectHistory: (history: UIHistory | null) => void;
};

type Store = State & Actions;

const createHistoryStore = () => {
  const store = (set: (fn: (state: State) => State) => void): Store => ({
    selectedHistory: null,
    selectHistory: (history: UIHistory | null) =>
      set((state) => ({ ...state, selectedHistory: history })),
  });

  return create<Store>()(devtools(store));
};

export const useHistoryStore = createHistoryStore();
