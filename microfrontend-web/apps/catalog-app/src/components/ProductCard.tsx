import type { Product } from "@ecommerce/shared-types";
import { Button, Card, Badge } from "@ecommerce/ui";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card variant="elevated" hoverable className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__link">
        <div className="product-card__image">{product.image}</div>
        <div className="product-card__body">
          <div className="product-card__top">
            <Badge variant="default">{product.category}</Badge>
            <span className="product-card__rating">⭐ {product.rating}</span>
          </div>
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__description">{product.description}</p>
        </div>
      </Link>
      <div className="product-card__footer">
        <span className="product-card__price">${product.price.toFixed(2)}</span>
        <Button variant="primary" size="sm" onClick={onAddToCart}>
          🛒 Agregar
        </Button>
      </div>
    </Card>
  );
}
