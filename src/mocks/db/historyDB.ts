import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

import {
  DEFAULT_INTERVAL,
  DIRECTION_NEXT,
  DIRECTION_PREV,
  STATUS_OFF,
  STATUS_ON,
} from '@/shared/config/constants';
import {
  addRandomMinutes,
  getISODateString,
  getTimestamp,
} from '@/shared/lib/utcDate';

interface HistoryItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface HistoryDB extends DBSchema {
  history: {
    key: string;
    value: HistoryItem;
    indexes: { 'by-date': string };
  };
  status: {
    key: string;
    value: {
      id: string;
      realtime: typeof STATUS_ON | typeof STATUS_OFF;
      interval: number;
    };
  };
}

export type SSEMessage = Uint8Array;

export type SSEController = ReadableStreamDefaultController<SSEMessage>;

let db: IDBPDatabase<HistoryDB>;

function generateRandomData(count: number, dataLength?: number): HistoryItem[] {
  const data: HistoryItem[] = [];
  let date = new Date();
  date.setHours(date.getHours() - count);

  for (let i = 0; i < count; i++) {
    date = addRandomMinutes(date);

    const sentenceCount = 3 + Math.floor(Math.random() * 8);
    let description = '';
    for (let j = 0; j < sentenceCount; j++) {
      description += `This is sentence ${j + 1}. `;
    }

    data.push({
      id: uuidv4(),
      name: `Random Title ${dataLength ? dataLength + 1 : i + 1}`,
      description: description.trim(),
      createdAt: getISODateString(date),
    });
  }

  return data;
}

export const initHistoryDB = async () => {
  db = await openDB<HistoryDB>('HISTORY_DB', 1, {
    upgrade(db) {
      const historyStore = db.createObjectStore('history', { keyPath: 'id' });
      historyStore.createIndex('by-date', 'createdAt');
      db.createObjectStore('status', { keyPath: 'id' });
    },
  });

  const historyStore = db
    .transaction('history', 'readwrite')
    .objectStore('history');
  const historyCount = await historyStore.count();

  if (historyCount === 0 || historyCount > 0) {
    await historyStore.clear();
    const initialData = generateRandomData(200);
    for (const item of initialData) {
      await historyStore.add(item);
    }
  }

  const statusStore = db
    .transaction('status', 'readwrite')
    .objectStore('status');
  await statusStore.put({
    id: 'config',
    realtime: STATUS_OFF,
    interval: DEFAULT_INTERVAL,
  });
};

export const getHistoryData = async (
  cursorId: string | null,
  limit: number,
  direction: typeof DIRECTION_NEXT | typeof DIRECTION_PREV,
): Promise<{
  data: HistoryItem[];
  nextCursor: string | null;
  prevCursor: string | null;
}> => {
  const historyStore = db
    .transaction('history', 'readonly')
    .objectStore('history');

  let data: HistoryItem[] = [];
  let nextCursor: string | null = null;
  let prevCursor: string | null = null;

  try {
    let allData = await historyStore.getAll();
    allData.sort((a, b) =>
      direction === DIRECTION_NEXT
        ? getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
        : getTimestamp(a.createdAt) - getTimestamp(b.createdAt),
    );

    if (cursorId) {
      const startIndex = allData.findIndex((item) => item.id === cursorId);
      if (startIndex !== -1) {
        allData = allData.slice(startIndex + 1);
      }
    }

    data = allData.slice(0, limit);

    if (data.length === limit && allData.length > limit) {
      nextCursor = data[data.length - 1].id;
    }
    if (cursorId) {
      prevCursor = cursorId;
    }
  } catch (error) {
    console.error('Error in getHistoryData:', error);
    throw error;
  }

  return { data, nextCursor, prevCursor };
};

const createSSEManager = () => {
  const controllers: Set<SSEController> = new Set();

  const removeController = (controller: SSEController) => {
    controllers.delete(controller);
  };

  const addController = (controller: SSEController) => {
    controllers.add(controller);
  };

  const broadcast = (message: Uint8Array) => {
    controllers.forEach((controller) => {
      try {
        controller.enqueue(message);
      } catch (error) {
        console.error('Error sending message to controller:', error);
        removeController(controller);
      }
    });
  };

  const getActiveConnections = () => controllers.size;

  return {
    addController,
    removeController,
    broadcast,
    getActiveConnections,
  };
};

export const sseManager = createSSEManager();

export const createSSEStream = () => {
  return new ReadableStream<SSEMessage>({
    start(controller) {
      sseManager.addController(controller);
      return () => {
        sseManager.removeController(controller);
      };
    },
  });
};

export const sendSSEMessage = (newData: HistoryItem) => {
  const encoder = new TextEncoder();
  const message = `data: ${JSON.stringify(newData)}\n\n`;
  sseManager.broadcast(encoder.encode(message));
};

let intervalId: NodeJS.Timeout | null = null;

export const updateStatus = async (
  realtime: typeof STATUS_ON | typeof STATUS_OFF,
  interval: number = DEFAULT_INTERVAL,
) => {
  const statusStore = db
    .transaction('status', 'readwrite')
    .objectStore('status');
  await statusStore.put({ id: 'config', realtime, interval });

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (realtime === STATUS_ON) {
    intervalId = setInterval(async () => {
      const historyStore = db
        .transaction('history', 'readwrite')
        .objectStore('history');

      const count = await historyStore.count();
      if (count >= 300 || sseManager.getActiveConnections() === 0) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return;
      }
      const newData = generateRandomData(1, count)[0];
      await historyStore.add(newData);

      sendSSEMessage(newData);
    }, interval);
  } else {
    if (intervalId) clearInterval(intervalId);
  }
};

export const getStatus = async () => {
  const statusStore = db
    .transaction('status', 'readonly')
    .objectStore('status');
  return await statusStore.get('config');
};
