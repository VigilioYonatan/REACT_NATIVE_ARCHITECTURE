import { useState } from "react";
import type { Product } from "@ecommerce/shared-types";
import { eventBus } from "@ecommerce/events";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "MacBook Pro 16″ M4",
    price: 2499.99,
    image: "💻",
    description: "Chip M4 Pro, 18GB RAM, 512GB SSD, pantalla Liquid Retina XDR",
    category: "Laptops",
    stock: 15,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Mouse MX Master 4S",
    price: 99.99,
    image: "🖱️",
    description: "Ergonómico, 8K DPI, sensor Darkfield, USB-C, compatible multi-OS",
    category: "Periféricos",
    stock: 42,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Teclado Mecánico K95 RGB",
    price: 179.99,
    image: "⌨️",
    description: "Cherry MX Brown, RGB per-key, reposamuñecas magnético, aluminio",
    category: "Periféricos",
    stock: 28,
    rating: 4.7,
  },
  {
    id: "4",
    name: 'Monitor 4K OLED 32"',
    price: 899.99,
    image: "🖥️",
    description: "OLED 4K, 120Hz, HDR 1000, 0.1ms, USB-C 90W, KVM switch",
    category: "Monitores",
    stock: 8,
    rating: 4.9,
  },
  {
    id: "5",
    name: "AirPods Pro 3",
    price: 249.99,
    image: "🎧",
    description: "ANC adaptativo, audio espacial, chip H3, 30h batería total",
    category: "Audio",
    stock: 55,
    rating: 4.6,
  },
  {
    id: "6",
    name: "Webcam 4K StreamCam",
    price: 149.99,
    image: "📷",
    description: "4K 60fps, autofocus con IA, dual mic, HDR, campo de visión 82°",
    category: "Periféricos",
    stock: 20,
    rating: 4.5,
  },
  {
    id: "7",
    name: "SSD NVMe 2TB Gen5",
    price: 199.99,
    image: "💾",
    description: "12.400 MB/s lectura, 11.800 MB/s escritura, TLC NAND, heatsink",
    category: "Almacenamiento",
    stock: 34,
    rating: 4.8,
  },
  {
    id: "8",
    name: "Hub USB-C 12-en-1",
    price: 79.99,
    image: "🔌",
    description: "HDMI 4K, DisplayPort, Ethernet 2.5G, SD/microSD, 100W PD",
    category: "Periféricos",
    stock: 60,
    rating: 4.4,
  },
];

const CATEGORIES = ["Todos", ...new Set(PRODUCTS.map((p) => p.category))];

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    eventBus.emit("cart:add-item", {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <section className="catalog">
      <div className="catalog__header">
        <h1 className="catalog__title">
          Catálogo de Productos
          <span className="catalog__count">{filtered.length} productos</span>
        </h1>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="catalog__filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? "filter-chip--active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="catalog__empty">
          <p>🔍 No se encontraron productos</p>
        </div>
      )}
    </section>
  );
}
