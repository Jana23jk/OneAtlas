"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const categories = ["All", "CRM", "HR", "Admin", "Operations", "Analytics"] as const;
const complexities = ["All", "SIMPLE", "MODERATE", "ADVANCED"] as const;

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "All";
  const complexity = searchParams.get("complexity") ?? "All";
  const q = searchParams.get("q") ?? "";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/templates?${params.toString()}`);
  }

  return (
    <div className="space-y-4 rounded-card border border-surface-border bg-white p-5 shadow-soft">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <Input
          placeholder="Search templates..."
          value={q}
          onChange={(e) => update("q", e.target.value)}
          className="pl-11"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Category
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => update("category", cat)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
              category === cat
                ? "border-brand-primary bg-brand-primary text-white shadow-primary"
                : "border-surface-border bg-white text-text-secondary hover:border-brand-primary/30 hover:text-brand-primary",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Complexity
        </span>
        {complexities.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => update("complexity", c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
              complexity === c
                ? "border-brand-primary bg-brand-primary text-white shadow-primary"
                : "border-surface-border bg-white text-text-secondary hover:border-brand-primary/30 hover:text-brand-primary",
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
