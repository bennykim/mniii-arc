import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type State = {
  realtimeHistory: UIHistory[];
  readState: { [id: string]: boolean };
  lastReadItemId: string | null;
  lastReadTime: string | null;
};

type Actions = {
  addRealtimeHistory: (histories: UIHistory[]) => void;
  clearRealtimeHistory: () => void;
  getRealtimeHistoryUnReadCount: () => number;
  setHistoryRead: (id: string) => void;
  setLastReadItemId: (id: string | null) => void;
  setLastReadTime: (time: string | null) => void;
};

type Store = State & Actions;

const createHistoryStore = () => {
  const store = (
    set: (fn: (state: State) => State) => void,
    get: () => State,
  ): Store => ({
    realtimeHistory: [],
    readState: {},
    lastReadItemId: null,
    lastReadTime: null,

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

    getRealtimeHistoryUnReadCount: () => {
      const { realtimeHistory, readState } = get();
      return realtimeHistory.filter((history) => !readState[history.id]).length;
    },

    setHistoryRead: (id: string) =>
      set((state) => ({
        ...state,
        readState: { ...state.readState, [id]: true },
      })),

    setLastReadItemId: (id: string | null) =>
      set((state) => ({
        ...state,
        lastReadItemId: id,
      })),

    setLastReadTime: (time: string | null) =>
      set((state) => ({
        ...state,
        lastReadTime: time,
      })),
  });

  return create<Store>()(devtools(store));
};

export const useHistoryStore = createHistoryStore();
