import { createRoot } from "react-dom/client";
import "@ecommerce/ui/styles.css";
import CheckoutFlow from "./App";
import "./checkout.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<CheckoutFlow />);
}
