"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { readCart, CART_KEY } from "@/lib/cart";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    { href: "/broodjes", label: "Broodjes" },
    
    { href: "/pasta", label: "Pasta's" },
    { href: "/desserts", label: "Desserts" },
  ];

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const BLUE = "#1800ad";
  const BEIGE = "#f4f5d3";

  return (
    <nav
      className="backdrop-blur-sm px-4 md:px-8 py-3 shadow-md border-b"
      style={{
        background:
          "linear-gradient(to bottom, rgba(24,0,173,0.40), rgba(24,0,173,0.28))",
        borderColor: "rgba(255,255,255,.10)",
      }}
    >
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center">
        {/* LINKS (logo + merknaam) */}
        <div className="flex items-center gap-3 justify-self-start col-start-1">
          <Image
            src="/images/snaque.png"
            alt="Snaque Logo"
            width={40}
            height={40}
            onClick={() => go("/")}
            className="cursor-pointer rounded-md ring-1 ring-white/15"
          />
          <h1
            onClick={() => go("/")}
            className="text-xl md:text-2xl font-extrabold tracking-wide cursor-pointer opacity-90"
            style={{ color: BEIGE }}
          >
            SNAQUE
          </h1>
        </div>

        {/* MIDDEN (desktop) */}
        <ul className="hidden md:flex gap-6 text-sm md:text-base font-medium justify-self-center md:col-start-2">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <button
                  onClick={() => go(l.href)}
                  className="px-2 py-1 rounded-md transition-colors ring-1"
                  style={{
                    color: active ? BEIGE : "#e5e7eb",
                    backgroundColor: active ? "rgba(244,245,211,.08)" : "transparent",
                    borderColor: "rgba(255,255,255,.10)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.backgroundColor = "rgba(244,245,211,.06)";
                    e.currentTarget.style.color = BEIGE;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#e5e7eb";
                    } else {
                      e.currentTarget.style.color = BEIGE;
                    }
                  }}
                >
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* RECHTS */}
        <div className="flex items-center gap-2 justify-self-end col-start-2 md:col-start-3 shrink-0">
          {/* Cart */}
          <button
            type="button"
            onClick={() => go("/cart")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md focus:outline-none ring-1 transition"
            style={{ color: BEIGE, borderColor: "rgba(255,255,255,.10)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(244,245,211,.06)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="Winkelmandje"
          >
            <IconCart />
            <CartCountBadge colors={{ BLUE, BEIGE }} />
          </button>

          {/* Contact (desktop) */}
          <button
            type="button"
            onClick={() => go("/contact")}
            className="hidden md:inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-1 transition"
            style={{ color: BEIGE, borderColor: "rgba(255,255,255,.10)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(244,245,211,.06)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Contact
          </button>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 ring-1 transition"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            style={{ color: BEIGE, borderColor: "rgba(255,255,255,.10)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(244,245,211,.06)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {open ? <IconClose /> : <IconHamburger />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        id="site-menu"
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="px-2 pt-2 pb-3 space-y-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <button
                    onClick={() => go(l.href)}
                    className="w-full text-left px-3 py-2 rounded-lg transition-colors ring-1"
                    style={{
                      color: BEIGE,
                      borderColor: "rgba(255,255,255,.10)",
                      backgroundColor: active
                        ? "rgba(244,245,211,.08)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(244,245,211,.06)")
                    }
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {l.label}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => go("/cart")}
                className="w-full text-left px-3 py-2 rounded-lg transition-colors ring-1"
                style={{ color: BEIGE, borderColor: "rgba(255,255,255,.10)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(244,245,211,.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                🛒 Winkelmandje
              </button>
            </li>
            <li>
              <button
                onClick={() => go("/contact")}
                className="w-full text-left px-3 py-2 rounded-lg transition-colors ring-1"
                style={{ color: BEIGE, borderColor: "rgba(255,255,255,.10)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(244,245,211,.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                ✉️ Contact
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

/* Live badge die naar localStorage + events luistert */
function CartCountBadge({
  colors = { BLUE: "#1800ad", BEIGE: "#f4f5d3" },
}: {
  colors?: { BLUE: string; BEIGE: string };
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const compute = () => {
      try {
        const items = readCart() as any[];
        const total = Array.isArray(items)
          ? items.reduce((s, it) => s + (it?.qty ?? 1), 0)
          : 0;
        setN(total);
      } catch {
        setN(0);
      }
    };
    compute();

    const onUpdate = () => compute();
    const onStorage = (e: StorageEvent) => {
      if (!e || e.key === CART_KEY) compute();
    };

    window.addEventListener("cart:updated", onUpdate as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:updated", onUpdate as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (n <= 0) return null;
  return (
    <span
      className="absolute -top-1 -right-1 min-w-[18px] px-1 h-[18px] rounded-full text-[11px] leading-[18px] font-semibold text-center ring-1"
      aria-label={`${n} items in winkelmandje`}
      style={{
        backgroundColor: colors.BEIGE,
        color: "#0b0f2a",
        borderColor: "rgba(0,0,0,.15)",
      }}
    >
      {n}
    </span>
  );
}

/* Icons */
function IconHamburger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconCart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 5h2l2.2 10.2A2 2 0 0 0 9.15 17h7.7a2 2 0 0 0 1.95-1.8l1.05-7.35H6.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20" r="1.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="20" r="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
