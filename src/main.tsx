import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./integrations/firebase/client";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "./index.css";

// Bump this whenever a release needs to evict an older PWA shell. The
// versioned worker URL + updateViaCache: "none" avoids Android browsers keeping
// a previous app shell until the browser's normal service-worker update window.
const SERVICE_WORKER_RELEASE = "2026-08-07-1";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const reloadKey = `hajcare-sw-reloaded-${SERVICE_WORKER_RELEASE}`;
    const reloadForNewWorker = () => {
      try {
        if (sessionStorage.getItem(reloadKey)) return;
        sessionStorage.setItem(reloadKey, "true");
        window.location.reload();
      } catch {
        // Service workers are an offline enhancement; never block the app if
        // browser storage is disabled.
      }
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      reloadForNewWorker,
      { once: true },
    );

    navigator.serviceWorker
      .register(`/sw.js?release=${SERVICE_WORKER_RELEASE}`, {
        updateViaCache: "none",
      })
      .then((registration) => registration.update())
      .catch((error) => {
        console.warn("Service worker registration failed", error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
