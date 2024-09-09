import { initDB } from "@/mocks/db";
import { groupHandlers } from "@/mocks/handlers/group";
import { itemHandlers } from "@/mocks/handlers/item";

initDB();

export const handlers = [...groupHandlers, ...itemHandlers];
