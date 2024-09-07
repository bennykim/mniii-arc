import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GroupManagement } from "@/widgets/GroupManagement";
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
        <GroupManagement />
      </AppProvider>
    </StrictMode>
  );
});
