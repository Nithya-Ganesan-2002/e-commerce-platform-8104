import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const CartCtx = createContext(null);

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Provides cart state synced with backend when logged in. */
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!token) return setCart({ items: [] });
    setLoading(true);
    try {
      const data = await api.getCart(token);
      setCart(data || { items: [] });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const add = async (productId, quantity = 1) => {
    if (!token) throw new Error("Login required");
    await api.addToCart(token, { productId, quantity });
    await refresh();
  };

  const update = async (productId, quantity) => {
    await api.updateCartItem(token, { productId, quantity });
    await refresh();
  };

  const remove = async (productId) => {
    await api.removeFromCart(token, productId);
    await refresh();
  };

  const clear = async () => {
    await api.clearCart(token);
    await refresh();
  };

  const cartCount = cart?.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0;
  const total = cart?.items?.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0) || 0;

  const value = useMemo(() => ({
    cart, cartCount, total, loading, refresh, add, update, remove, clear
  }), [cart, cartCount, total, loading]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Access cart state and actions. */
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
