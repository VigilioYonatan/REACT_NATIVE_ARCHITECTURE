import { createRoot } from "react-dom/client";
import "@ecommerce/ui/styles.css";
import ProductList from "./pages/ProductList";

// Standalone mount — for independent development
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<ProductList />);
}
