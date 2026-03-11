import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@ecommerce/auth";
import { Navbar } from "./layout/Navbar";
import { RemoteErrorBoundary } from "./RemoteErrorBoundary";
import { LoadingSkeleton } from "./layout/LoadingSkeleton";

// 🔥 Remote imports — loaded at RUNTIME from other dev servers
const CatalogList = lazy(() => import("catalog/ProductList"));
const CatalogDetail = lazy(() => import("catalog/ProductDetail"));
const CartPage = lazy(() => import("cart/CartPage"));
const CheckoutFlow = lazy(() => import("checkout/CheckoutFlow"));

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="container main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <RemoteErrorBoundary remoteName="catalog">
                    <Suspense fallback={<LoadingSkeleton rows={4} />}>
                      <CatalogList />
                    </Suspense>
                  </RemoteErrorBoundary>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <RemoteErrorBoundary remoteName="catalog">
                    <Suspense fallback={<LoadingSkeleton rows={2} />}>
                      <CatalogDetail />
                    </Suspense>
                  </RemoteErrorBoundary>
                }
              />
              <Route
                path="/cart"
                element={
                  <RemoteErrorBoundary remoteName="cart">
                    <Suspense fallback={<LoadingSkeleton rows={3} />}>
                      <CartPage />
                    </Suspense>
                  </RemoteErrorBoundary>
                }
              />
              <Route
                path="/checkout/*"
                element={
                  <RemoteErrorBoundary remoteName="checkout">
                    <Suspense fallback={<LoadingSkeleton rows={2} />}>
                      <CheckoutFlow />
                    </Suspense>
                  </RemoteErrorBoundary>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
