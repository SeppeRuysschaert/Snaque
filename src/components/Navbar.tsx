"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sluit menu bij routewissel of Esc
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    { href: "/broodjes", label: "Broodjes / Panini's" },
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
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
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

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 text-sm md:text-base font-medium">
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

        {/* Mobile: hamburger */}
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
          </ul>
        </div>
      </div>
    </nav>
  );
}

/* icons (geen extra lib nodig) */
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
