import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/components.css";
import "./styles/intro.css";
import "./styles/finale.css";
import "./styles/rail.css";
import "./styles/lightbox.css";
import "./styles/chapters.css";
import "./styles/decor.css";
import "./styles/motion.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
