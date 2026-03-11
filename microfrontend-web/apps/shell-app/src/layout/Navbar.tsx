import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@ecommerce/auth";
import { useCartCount } from "../hooks/useCartCount";

export function Navbar() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const cartCount = useCartCount();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "nav-link--active" : "";

  const handleLogin = () => {
    login("demo@ecommerce.com", "password123");
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🛍️</span>
          <span className="navbar__logo-text">MFE Store</span>
        </Link>

        {/* Navigation */}
        <nav className="navbar__nav">
          <Link to="/" className={`nav-link ${isActive("/")}`}>
            🏠 Catálogo
          </Link>
          <Link to="/cart" className={`nav-link ${isActive("/cart")}`}>
            🛒 Carrito
            {cartCount > 0 && (
              <span className="nav-link__badge">{cartCount}</span>
            )}
          </Link>
          <Link to="/checkout" className={`nav-link ${isActive("/checkout")}`}>
            💳 Checkout
          </Link>
        </nav>

        {/* Auth */}
        <div className="navbar__auth">
          {isAuthenticated ? (
            <div className="navbar__user">
              <span className="navbar__user-name">👋 {user?.name}</span>
              <button className="btn btn--ghost btn--sm" onClick={logout}>
                Salir
              </button>
            </div>
          ) : (
            <button className="btn btn--primary btn--sm" onClick={handleLogin}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
