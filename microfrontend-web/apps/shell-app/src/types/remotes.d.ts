// Type declarations for remote modules (Module Federation)
declare module "catalog/ProductList" {
  const ProductList: React.ComponentType;
  export default ProductList;
}

declare module "catalog/ProductDetail" {
  const ProductDetail: React.ComponentType;
  export default ProductDetail;
}

declare module "cart/CartPage" {
  const CartPage: React.ComponentType;
  export default CartPage;
}

declare module "checkout/CheckoutFlow" {
  const CheckoutFlow: React.ComponentType;
  export default CheckoutFlow;
}
