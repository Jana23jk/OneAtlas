"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavLink } from "@/config/site";

interface MobileNavProps {
  links: readonly NavLink[];
  light?: boolean;
}

export function MobileNav({ links, light = false }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const buttonLineBg = light ? "bg-[#0A2540]" : "bg-white";
  const panelBg = light ? "rgba(255, 255, 255, 0.98)" : "rgba(10, 37, 64, 0.97)";
  const panelBorder = light ? "border-[#635BFF]/10" : "border-white/10";
  const itemBorder = light ? "border-[#635BFF]/5" : "border-white/5";
  const itemText = light ? "text-[#475467] hover:text-[#635BFF]" : "text-white/70 hover:text-white";
  const signInClass = light 
    ? "border-[#635BFF]/20 text-[#475467] hover:border-[#635BFF]/40 hover:text-[#635BFF] hover:bg-[#635BFF]/5"
    : "border-white/20 text-white hover:border-white/40";

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
          className={`block h-[2px] w-5 transition-all duration-300 ${buttonLineBg} ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-5 transition-all duration-300 ${buttonLineBg} ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-5 transition-all duration-300 ${buttonLineBg} ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Slide-down panel */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden transition-all duration-300 ease-in-out md:hidden shadow-xl rounded-b-xl border-x ${light ? "border-b border-[#635BFF]/10" : ""} ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: panelBg, backdropFilter: "blur(16px)" }}
      >
        <nav className={`flex flex-col border-t px-6 py-4 ${panelBorder}`}>
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`border-b py-3 text-sm font-medium transition-colors ${itemBorder} ${itemText}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3 pb-2">
            <Link
              href="/generate"
              onClick={() => setOpen(false)}
              className={`rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-all ${signInClass}`}
            >
              Sign In
            </Link>
            <Link
              href="/generate"
              onClick={() => setOpen(false)}
              className={`rounded-lg bg-gradient-to-r from-[#635BFF] to-[#7A73FF] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-[#635BFF]/15 hover:opacity-95 hover:shadow-lg transition-all`}
            >
              Start Building
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
