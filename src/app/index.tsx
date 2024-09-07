import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import DashboardPage from "@/pages/dashboard";
import { AppProvider } from "./providers";

import "./styles/global.css";

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import("@/mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppProvider>
        <DashboardPage />
      </AppProvider>
    </StrictMode>
  );
});
