"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavLink } from "@/config/site";

interface MobileNavProps {
  links: readonly NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col gap-[5px] p-2 md:hidden"
      >
        <span
          className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Slide-down panel */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "rgba(10, 37, 64, 0.97)", backdropFilter: "blur(16px)" }}
      >
        <nav className="flex flex-col border-t border-white/10 px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3 pb-2">
            <Link
              href="/generate"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/20 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:border-white/40"
            >
              Sign In
            </Link>
            <Link
              href="/generate"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[#635BFF] px-4 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start Building
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
