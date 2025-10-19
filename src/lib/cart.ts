// lib/cart.ts
"use client";

export const CART_KEY = "cart:v2"; // schema bump

export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty?: number;
  removed?: string[];
  note?: string; // blijft beschikbaar voor toekomstige vrije opmerkingen
  addedAt?: number;

  category?: string;
  timeslot?: "11:30" | "12:00" | "12:30" | "13:00";
  size?: "small" | "medium" | "large";
  sauces?: string[];

  bread?: "wit" | "bruin";
  cheese?: "met" | "zonder"; // NIEUW
};

// --- interne helpers ---
const LEGACY_CART_KEY = "cart:v1";

function parseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function migrateV1ToV2(items: CartItem[]): CartItem[] {
  return items.map((it) => {
    if (!it.cheese) {
      const n = (it.note ?? "").toLowerCase();
      if (n.includes("zonder kaas")) return { ...it, cheese: "zonder" };
      if (n.includes("met kaas")) return { ...it, cheese: "met" };
    }
    return it;
  });
}

// --- public API ---
export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  // Probeer v2
  const v2 = parseJSON<CartItem[]>(localStorage.getItem(CART_KEY));
  if (Array.isArray(v2)) return v2;

  // Val terug op v1 en migreer on-the-fly
  const v1 = parseJSON<CartItem[]>(localStorage.getItem(LEGACY_CART_KEY));
  if (Array.isArray(v1)) {
    const migrated = migrateV1ToV2(v1);
    // direct wegschrijven naar v2 zodat navbar/listeners de juiste key gebruiken
    writeCart(migrated);
    return migrated;
  }

  return [];
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
