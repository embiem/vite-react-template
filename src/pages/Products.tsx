import { ProductList } from "../components/ProductList";
import { useCart } from "../lib/useCart";

function ProductsPage() {
  const { cart, totalPrice } = useCart();
  return (
    <div className="max-w-4xl mx-auto">
      <h3>Cart</h3>
      <p>Total: ${totalPrice}</p>
      <pre>{JSON.stringify(cart)}</pre>

      <ProductList />
    </div>
  );
}

export default ProductsPage;
