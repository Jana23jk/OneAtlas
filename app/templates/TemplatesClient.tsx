"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilterBar } from "@/components/templates/FilterBar";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateModal } from "@/components/templates/TemplateModal";
import { templates } from "@/config/templates";
import type { AppTemplate } from "@/types/app";
import { SlidersHorizontal } from "lucide-react";

export function TemplatesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activePreviewTemplate, setActivePreviewTemplate] = useState<AppTemplate | null>(null);

  const category = searchParams.get("category") || "All";
  const complexity = searchParams.get("complexity") || "All";
  const q = searchParams.get("q") || "";

  // Client-side filtering logic
  const filteredTemplates = templates.filter((tpl) => {
    // 1. Category Filter
    if (category !== "All" && tpl.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    // 2. Complexity Filter
    if (complexity !== "All" && tpl.complexity.toLowerCase() !== complexity.toLowerCase()) {
      return false;
    }
    // 3. Search Query Filter
    if (q.trim() !== "") {
      const searchLower = q.toLowerCase();
      const matchName = tpl.name.toLowerCase().includes(searchLower);
      const matchDesc = tpl.description.toLowerCase().includes(searchLower);
      const matchTags = tpl.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      if (!matchName && !matchDesc && !matchTags) {
        return false;
      }
    }
    return true;
  });

  const clearFilters = () => {
    router.push("/templates");
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <FilterBar />

      {/* Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onPreview={(t) => setActivePreviewTemplate(t)}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center flex flex-col items-center gap-4 justify-center">
          <SlidersHorizontal className="text-white/40" size={32} />
          <div className="space-y-1">
            <h3 className="font-semibold text-white">No templates found</h3>
            <p className="text-sm text-white/50">Try adjusting your filters or search keywords.</p>
          </div>
          <button
            onClick={clearFilters}
            className="rounded bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:border-white/20 transition-all cursor-pointer"
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Modal */}
      {activePreviewTemplate && (
        <TemplateModal
          template={activePreviewTemplate}
          onClose={() => setActivePreviewTemplate(null)}
        />
      )}
    </div>
  );
}

export default TemplatesClient;
