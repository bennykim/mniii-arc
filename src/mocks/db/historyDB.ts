import { DBSchema, IDBPDatabase, openDB } from "idb";
import { v4 as uuidv4 } from "uuid";

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
    indexes: { "by-date": string };
  };
  status: {
    key: string;
    value: {
      id: string;
      realtime: "on" | "off";
      interval: number;
    };
  };
}

let db: IDBPDatabase<HistoryDB>;

function generateRandomData(count: number): HistoryItem[] {
  const data: HistoryItem[] = [];
  let date = new Date();
  date.setHours(date.getHours() - count);

  for (let i = 0; i < count; i++) {
    const minutesToAdd = 2 + Math.floor(Math.random() * 4);
    date = new Date(date.getTime() + minutesToAdd * 30000);

    const sentenceCount = 3 + Math.floor(Math.random() * 8);
    let description = "";
    for (let j = 0; j < sentenceCount; j++) {
      description += `This is sentence ${j + 1}. `;
    }

    data.push({
      id: uuidv4(),
      name: `Random Title ${i + 1}`,
      description: description.trim(),
      createdAt: date.toISOString(),
    });
  }

  return data;
}

export const initHistoryDB = async () => {
  db = await openDB<HistoryDB>("HISTORY_DB", 1, {
    upgrade(db) {
      const historyStore = db.createObjectStore("history", { keyPath: "id" });
      historyStore.createIndex("by-date", "createdAt");
      db.createObjectStore("status", { keyPath: "id" });
    },
  });

  const historyStore = db
    .transaction("history", "readwrite")
    .objectStore("history");
  const historyCount = await historyStore.count();

  if (historyCount === 0 || historyCount > 0) {
    await historyStore.clear();
    const initialData = generateRandomData(200);
    for (const item of initialData) {
      await historyStore.add(item);
    }
  }

  const statusStore = db
    .transaction("status", "readwrite")
    .objectStore("status");
  await statusStore.put({
    id: "config",
    realtime: "off" as const,
    interval: 30000,
  });
};

export const getHistoryData = async (
  cursorId: string | null,
  limit: number,
  direction: "next" | "prev" = "next"
): Promise<{
  data: HistoryItem[];
  nextCursor: string | null;
  prevCursor: string | null;
}> => {
  const historyStore = db
    .transaction("history", "readonly")
    .objectStore("history");

  let data: HistoryItem[] = [];
  let nextCursor: string | null = null;
  let prevCursor: string | null = null;

  try {
    let allData = await historyStore.getAll();
    allData.sort((a, b) =>
      direction === "next"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
    console.error("Error in getHistoryData:", error);
    throw error;
  }

  return { data, nextCursor, prevCursor };
};

let intervalId: NodeJS.Timeout | null = null;

export const updateStatus = async (
  realtime: "on" | "off",
  interval: number = 30000
) => {
  const statusStore = db
    .transaction("status", "readwrite")
    .objectStore("status");
  await statusStore.put({ id: "config", realtime, interval });

  if (realtime === "on") {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(async () => {
      const historyStore = db
        .transaction("history", "readwrite")
        .objectStore("history");
      const count = await historyStore.count();
      if (count >= 300) {
        clearInterval(intervalId!);
        return;
      }
      const newData = generateRandomData(1)[0];
      await historyStore.add(newData);
    }, interval);
  } else {
    if (intervalId) clearInterval(intervalId);
  }
};

export const getStatus = async () => {
  const statusStore = db
    .transaction("status", "readonly")
    .objectStore("status");
  return await statusStore.get("config");
};
