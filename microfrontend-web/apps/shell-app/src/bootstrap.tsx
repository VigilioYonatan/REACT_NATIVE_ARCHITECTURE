import { createRoot } from "react-dom/client";
import "@ecommerce/ui/styles.css";
import "./app.css";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(<App />);
