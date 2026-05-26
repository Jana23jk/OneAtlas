"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const categories = ["All", "CRM", "HR", "Admin", "Operations", "Analytics"];
const complexities = ["All", "Simple", "Moderate", "Advanced"];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "All";
  const currentComplexity = searchParams.get("complexity") || "All";
  const searchQuery = searchParams.get("q") || "";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === "All" || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/templates?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6">
      {/* Search and Complexity Selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateFilters({ q: e.target.value })}
            placeholder="Search templates, tags..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition-all"
            aria-label="Search templates"
          />
        </div>

        {/* Complexity Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs font-medium text-white/50">Complexity:</span>
          <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg text-xs w-full sm:w-auto">
            {complexities.map((comp) => (
              <button
                key={comp}
                onClick={() => updateFilters({ complexity: comp })}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  currentComplexity === comp ? "bg-[#635BFF] text-white" : "text-white/60 hover:text-white"
                }`}
                aria-label={`Filter by ${comp} complexity`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilters({ category: cat })}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              currentCategory === cat
                ? "bg-[#635BFF]/10 text-[#8a84ff] border-[#635BFF]/30"
                : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white"
            }`}
            aria-label={`Filter category ${cat}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
