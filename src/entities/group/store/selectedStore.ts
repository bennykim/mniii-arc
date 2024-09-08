import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  selectedGroup: UIGroup | null;
};

type Actions = {
  selectGroup: (group: UIGroup) => void;
  unselectGroup: () => void;
};

type Store = State & Actions;

const createSelectedStore = () => {
  const store = (set: (fn: (state: State) => State) => void): Store => ({
    selectedGroup: null,
    selectGroup: (group: UIGroup) =>
      set((state) => ({ ...state, selectedGroup: group })),
    unselectGroup: () => set((state) => ({ ...state, selectedGroup: null })),
  });

  return create<Store>()(devtools(store));
};

export const useSelectedStore = createSelectedStore();
