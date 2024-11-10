import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  selectedGroup: UIGroup | null;
  editingGroup: UIGroup | null;
};

type Actions = {
  selectGroup: (group: UIGroup | null) => void;
  editGroup: (group: UIGroup | null) => void;
  uneditGroup: () => void;
};

type Store = State & Actions;

const createGroupStore = () => {
  const store = (set: (fn: (state: State) => State) => void): Store => ({
    selectedGroup: null,
    editingGroup: null,
    selectGroup: (group: UIGroup | null) =>
      set((state) => ({ ...state, selectedGroup: group })),
    editGroup: (group: UIGroup | null) =>
      set((state) => ({ ...state, editingGroup: group })),
    uneditGroup: () => set((state) => ({ ...state, editingGroup: null })),
  });

  return create<Store>()(devtools(store));
};

export const useGroupStore = createGroupStore();
