import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SocketMapApp from "./SocketMapApp.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketMapApp />
  </StrictMode>,
);
