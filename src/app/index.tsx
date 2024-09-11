import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppProvider, ThemeProvider } from "@/app/providers";
import DashboardPage from "@/pages/dashboard";
import { STORAGE_KEY, THEME } from "@/shared/config/constants";

import "./styles/global.css";

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import("@/mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider defaultTheme={THEME.DARK} storageKey={STORAGE_KEY}>
        <AppProvider>
          <DashboardPage />
        </AppProvider>
      </ThemeProvider>
    </StrictMode>
  );
});
