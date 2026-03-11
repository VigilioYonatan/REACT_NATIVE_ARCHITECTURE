import { useParams } from "react-router-dom";
import type { Product } from "@ecommerce/shared-types";
import { eventBus } from "@ecommerce/events";
import { Button } from "@ecommerce/ui";

// In a real app, this would fetch from an API
const PRODUCTS: Record<string, Product> = {
  "1": { id: "1", name: "MacBook Pro 16″ M4", price: 2499.99, image: "💻", description: "Chip M4 Pro, 18GB RAM, 512GB SSD", category: "Laptops", stock: 15, rating: 4.9 },
  "2": { id: "2", name: "Mouse MX Master 4S", price: 99.99, image: "🖱️", description: "Ergonómico, 8K DPI", category: "Periféricos", stock: 42, rating: 4.8 },
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? PRODUCTS[id] : null;

  if (!product) {
    return (
      <div className="product-detail__empty">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    eventBus.emit("cart:add-item", {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <section className="product-detail">
      <div className="product-detail__image">{product.image}</div>
      <div className="product-detail__info">
        <span className="product-detail__category">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="product-detail__description">{product.description}</p>
        <div className="product-detail__price">${product.price.toFixed(2)}</div>
        <div className="product-detail__meta">
          <span>⭐ {product.rating}</span>
          <span>📦 {product.stock} en stock</span>
        </div>
        <Button variant="primary" size="lg" onClick={handleAddToCart}>
          🛒 Agregar al Carrito
        </Button>
      </div>
    </section>
  );
}
