"use client";

import { useState } from "react";
import {
  Bell,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RuntimeShellProps {
  children: React.ReactNode;
  appName: string;
  templateName: string;
  templateSlug: string;
  version: number;
  isInventory?: boolean;
}

export function RuntimeShell({
  children,
  appName,
  templateName,
  templateSlug,
  version,
  isInventory = false,
}: RuntimeShellProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const title = isInventory ? "Inventory System" : appName;

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="runtime-page-bg flex h-screen flex-col overflow-hidden">
      <div className="glow-purple -left-24 top-0 opacity-50" aria-hidden />
      <div className="glow-pink right-0 top-1/3 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute bottom-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7A73FF]/8 blur-3xl animate-float"
        aria-hidden
      />

      <header className="runtime-header sticky top-0 z-30 shrink-0">
        <div className="mx-auto flex h-[72px] max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <h1 className="text-xl font-bold text-[#1A1F36]">{title}</h1>
              <p className="text-xs text-[#667085]">
                {isInventory ? appName : templateName} · Schema v{version}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7A73FF]/30 bg-[rgba(122, 115, 255,0.1)] px-2.5 py-1 text-xs font-semibold text-[#7A73FF]">
                <span className="status-pulse-dot status-pulse-success h-2 w-2 rounded-full bg-[#7A73FF]" />
                Live
              </span>
              <span className="rounded-full border border-[#E7EAF5] bg-[#FAFBFF] px-2.5 py-1 text-xs font-semibold capitalize text-[#667085]">
                {templateSlug.includes("staging") ? "staging" : "production"}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
            <div className="relative hidden min-w-[200px] flex-1 sm:block sm:max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isInventory ? "Search inventory…" : "Search…"}
                className="input-premium h-10 w-full pl-9 py-2 text-sm"
                aria-label="Search"
              />
            </div>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7EAF5] bg-white text-[#667085] transition-colors hover:border-[#7A73FF]/30 hover:text-[#7A73FF]"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FFB17A]" />
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7EAF5] bg-white text-[#667085] transition-colors hover:border-[#7A73FF]/30 hover:text-[#7A73FF]",
                refreshing && "pointer-events-none opacity-60",
              )}
              aria-label="Refresh"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            </button>
            <div className="flex h-10 items-center gap-2 rounded-xl border border-[#E7EAF5] bg-white pl-1 pr-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7A73FF] to-[#6B64E8] text-white">
                <User size={16} />
              </span>
              <span className="hidden text-xs font-semibold text-[#1A1F36] sm:inline">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scroll-smooth">{children}</div>
      </main>
    </div>
  );
}
