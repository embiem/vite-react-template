import { useCallback, useEffect, useMemo } from "react";
import { atom, useAtom } from "jotai";
import { useProducts } from "./useProducts";

type ItemID = string | number;

type CartData = Record<ItemID, number>;

const cartStorageKey = "cartData";

const cartAtom = atom<CartData>({});

export function useCart() {
  const [cartData, setCartData] = useAtom(cartAtom);

  const { productIdMap } = useProducts();

  const totalPrice = useMemo(() => {
    let total = 0;
    for (const productId in cartData) {
      const amount = cartData[productId];

      const product = productIdMap[productId];

      if (!product) {
        console.warn("No product with id " + productId);
      } else {
        total += amount * product.price;
      }
    }

    return total;
  }, [cartData, productIdMap]);

  useEffect(() => {
    const rawCartData = localStorage.getItem(cartStorageKey);
    if (rawCartData) {
      try {
        setCartData(JSON.parse(rawCartData));
      } catch (err) {
        console.error(err);
      }
    }
  }, [setCartData]);

  const addItem = useCallback(
    (itemId: ItemID) => {
      console.log("addItem", itemId);
      setCartData((cartData) => {
        const newCartData = { ...cartData };
        if (!(itemId in cartData)) {
          newCartData[itemId] = 0;
        }
        newCartData[itemId]++;

        localStorage.setItem(cartStorageKey, JSON.stringify(newCartData));
        return newCartData;
      });
    },
    [setCartData],
  );

  const removeItem = useCallback(
    (itemId: ItemID, amount = 1) => {
      setCartData((cartData) => {
        const newCartData = { ...cartData };
        if (itemId in cartData) {
          newCartData[itemId] -= amount;
          if (newCartData[itemId] <= 0) {
            delete newCartData[itemId];
          }
        }

        localStorage.setItem(cartStorageKey, JSON.stringify(newCartData));
        return cartData;
      });
    },
    [setCartData],
  );

  return {
    cart: cartData,
    addItem,
    removeItem,
    totalPrice,
  };
}
