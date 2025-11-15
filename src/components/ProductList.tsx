import { useCart } from "../lib/useCart";
import { useProducts } from "../lib/useProducts";
import { Link } from "react-router-dom";

export function ProductList() {
  const { addItem } = useCart();

  const {
    res: { data, isLoading, error },
  } = useProducts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-4">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((item) => (
          <div key={item.id} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{item.title}</h3>
              <p>${item.price}</p>
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    addItem(item.id);
                  }}
                >
                  Add to Cart
                </button>
                <Link to={`/products/${item.id}`} className="btn btn-secondary">
                  Edit
                </Link>
              </div>
              <p>{item.description}</p>
              <img src={item.image} className="w-full h-48 object-contain" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
