import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { worker } from "./mocks/browser";

import App from "./App.tsx";

import "./index.css";

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});

async function enableMocking() {
  if (import.meta.env.DEV) {
    worker.start();
  }
}
