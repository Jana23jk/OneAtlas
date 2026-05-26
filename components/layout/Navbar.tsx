"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M14 2L25.26 8.5V21.5L14 28L2.74 21.5V8.5L14 2Z"
        stroke="#635BFF"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="14" cy="14" r="5" stroke="#635BFF" strokeWidth="1.5" fill="none" />
      <circle cx="14" cy="14" r="2" fill="#635BFF" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="glass-nav fixed left-0 right-0 top-0 z-50 px-4">
      <div className="mx-auto flex h-nav max-w-7xl items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <LogoIcon />
          <span className="text-lg font-bold tracking-tight text-text-primary">
            OneAtlas
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.navLinks.map((link) => {
            const active =
              link.href.startsWith("/") && pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-300",
                  active
                    ? "text-brand-primary"
                    : "text-text-secondary hover:text-brand-primary",
                )}
              >
                {link.label}
                {active ? (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-primary" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/generate">Start Building →</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <MobileNav links={siteConfig.navLinks} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
