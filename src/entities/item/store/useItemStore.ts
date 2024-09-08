import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  editingItem: UIItem | null;
};

type Actions = {
  editItem: (group: UIItem | null) => void;
  uneditItem: () => void;
};

type Store = State & Actions;

const createItemStore = () => {
  const store = (set: (fn: (state: State) => State) => void): Store => ({
    editingItem: null,
    editItem: (group: UIItem | null) =>
      set((state) => ({ ...state, editingItem: group })),
    uneditItem: () => set((state) => ({ ...state, editingItem: null })),
  });

  return create<Store>()(devtools(store));
};

export const useItemStore = createItemStore();
