// lib/cart.ts
"use client";

export const CART_KEY = "cart:v1";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty?: number;
  removed?: string[];  // weggelaten ingrediënten
  note?: string;
  addedAt?: number;
};

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Notify alle listeners (Navbar, etc.)
  window.dispatchEvent(
    new CustomEvent("cart:updated", {
      detail: { count: countItems(items), items },
    })
  );
}

export function countItems(items: CartItem[] = readCart()) {
  return items.reduce((s, it) => s + (it.qty ?? 1), 0);
}

export function addToCart(item: CartItem) {
  const items = readCart();
  items.push({
    ...item,
    qty: item.qty ?? 1,
    addedAt: Date.now(),
  });
  writeCart(items);
}

export function setCart(items: CartItem[]) {
  writeCart(items);
}

export function clearCart() {
  writeCart([]);
}
