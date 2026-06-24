import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  size: string;
  price: number;
  qty: number;
  image?: string;
};

export type Order = {
  id: string;
  date: string;
  customer: { name: string; mobile: string; address: string; city: string; pincode: string };
  items: CartItem[];
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: "Confirmed" | "Packed" | "Shipped" | "Out For Delivery" | "Delivered";
};

type ShopState = {
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQty: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => void;
};

const ShopContext = createContext<ShopState | null>(null);

const STORAGE_KEY = "svom_shop_v1";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setCart(data.cart || []);
        setOrders(data.orders || []);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, orders }));
  }, [cart, orders, hydrated]);

  const addToCart: ShopState["addToCart"] = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id && p.size === item.size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  };

  const removeFromCart: ShopState["removeFromCart"] = (id, size) =>
    setCart((prev) => prev.filter((p) => !(p.id === id && p.size === size)));

  const updateQty: ShopState["updateQty"] = (id, size, qty) =>
    setCart((prev) =>
      prev.map((p) => (p.id === id && p.size === size ? { ...p, qty: Math.max(1, qty) } : p))
    );

  const clearCart = () => setCart([]);

  const placeOrder: ShopState["placeOrder"] = (order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
  };

  return (
    <ShopContext.Provider
      value={{ cart, orders, addToCart, removeFromCart, updateQty, clearCart, placeOrder }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}