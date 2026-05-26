"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavLink } from "@/config/site";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  links: readonly NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col gap-[5px] p-2 md:hidden"
      >
        <span
          className={`block h-0.5 w-5 bg-text-primary transition-all duration-300 ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-text-primary transition-all duration-300 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-text-primary transition-all duration-300 ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      <div
        className={`absolute left-0 right-0 top-full overflow-hidden rounded-b-card border border-surface-border border-t-0 bg-white/95 shadow-card backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-surface-border py-3 text-sm font-medium text-text-secondary transition-colors hover:text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3 pb-2">
            <Button variant="secondary" asChild>
              <Link href="/login" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild>
              <Link href="/generate" onClick={() => setOpen(false)}>
                Start Building
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
