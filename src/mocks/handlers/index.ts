import { initGroupsDB, initHistoryDB } from "@/mocks/db";
import { groupHandlers } from "@/mocks/handlers/groupHandlers";
import { historyHandlers } from "@/mocks/handlers/historyHandlers";
import { itemHandlers } from "@/mocks/handlers/itemHandlers";

async function initializeDatabases() {
  try {
    await Promise.all([initGroupsDB(), initHistoryDB()]);
    console.log("All databases initialized successfully");
  } catch (error) {
    console.error("Failed to initialize databases:", error);
    throw error;
  }
}

export const initializeHandlers = async () => {
  await initializeDatabases();
  return [...groupHandlers, ...itemHandlers, ...historyHandlers];
};
