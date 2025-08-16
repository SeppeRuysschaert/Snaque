"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { readCart, countItems, CART_KEY } from "@/lib/cart";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
  if (typeof window === "undefined") return;
  // init
  setCartCount(countItems());
  // updates vanuit de app
  const onUpdate = (e: Event) => {
    const ce = e as CustomEvent<{ count: number }>;
    if (ce.detail?.count != null) setCartCount(ce.detail.count);
  };
  // updates vanuit andere tabs/vensters
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY) setCartCount(countItems());
  };
  window.addEventListener("cart:updated", onUpdate as EventListener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("cart:updated", onUpdate as EventListener);
    window.removeEventListener("storage", onStorage);
  };
}, []);

  const links = [
    { href: "/broodjes", label: "Broodjes" },
    { href: "/soepen", label: "Soepen" },
    { href: "/pasta", label: "Pasta's" },
    { href: "/desserts", label: "Desserts" },
  ];

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <nav className="bg-gray-800/95 backdrop-blur px-4 md:px-8 py-3 shadow-md">
      {/* GRID: mobiel = [logo | spacer | icons], desktop = [links | menu | icons] */}
      <div className="mx-auto max-w-6xl grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center">
        {/* LINKS: logo + naam */}
        <div className="flex items-center gap-3 justify-self-start">
          <Image
            src="/images/snaque.png"
            alt="Snaque Logo"
            width={40}
            height={40}
            onClick={() => go("/")}
            className="cursor-pointer"
          />
          <h1
            onClick={() => go("/")}
            className="text-xl md:text-2xl font-bold text-white cursor-pointer"
          >
            Snaque
          </h1>
        </div>

        {/* MIDDEN: desktop menu (gecentreerd, verborgen op mobiel) */}
        <ul className="hidden md:flex gap-6 text-sm md:text-base font-medium justify-self-center">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <button
                  onClick={() => go(l.href)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    active
                      ? "text-white bg-white/10"
                      : "text-gray-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* RECHTS: winkelmandje + hamburger (mobiel) */}
        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            onClick={() => go("/cart")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Winkelmandje"
          >
            <IconCart />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] px-1 h-[18px] rounded-full bg-amber-500 text-[11px] leading-[18px] text-black font-semibold text-center"
                aria-label={`${cartCount} items in winkelmandje`}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconHamburger />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown (slide-down) */}
      <div
        id="site-menu"
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="px-2 pt-2 pb-3 space-y-1 text-gray-200">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <button
                    onClick={() => go(l.href)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => go("/cart")}
                className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-white/10 hover:text-white"
              >
                🛒 Winkelmandje
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

/* Icons */
function IconHamburger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconCart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 5h2l2.2 10.2A2 2 0 0 0 9.15 17h7.7a2 2 0 0 0 1.95-1.8l1.05-7.35H6.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9.5" cy="20" r="1.5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17.5" cy="20" r="1.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
