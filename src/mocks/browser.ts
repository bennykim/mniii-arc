import { initializeHandlers } from "@/mocks/handlers";
import { setupWorker } from "msw/browser";

export async function startMSW() {
  try {
    const handlers = await initializeHandlers();
    const worker = setupWorker(...handlers);
    await worker.start();
    console.log("MSW started successfully");
  } catch (error) {
    console.error("Failed to start MSW:", error);
  }
}
