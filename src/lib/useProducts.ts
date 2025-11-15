import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/products`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
}

export function useProducts() {
  const res = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const productIdMap = useMemo<Record<string, Product>>(() => {
    const idMap: Record<string, Product> = {};
    if (res.data) {
      res.data.forEach((product) => {
        idMap[product.id] = product;
      });
    }
    return idMap;
  }, [res.data]);

  return { res, productIdMap };
}
