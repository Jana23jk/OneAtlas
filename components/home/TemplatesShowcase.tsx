import Link from "next/link";
import type { AppTemplate } from "@/types/app";

const complexityConfig: Record<AppTemplate["complexity"], { label: string; color: string; bg: string }> = {
  SIMPLE:   { label: "Simple",   color: "#00D4B1", bg: "rgba(0,212,177,0.12)"  },
  MODERATE: { label: "Moderate", color: "#f8bc42", bg: "rgba(248,188,66,0.12)" },
  ADVANCED: { label: "Advanced", color: "#FF5996", bg: "rgba(255,89,150,0.12)" },
};

const categoryColors: Record<string, string> = {
  CRM:        "#635BFF",
  HR:         "#00D4B1",
  Admin:      "#f8bc42",
  Operations: "#FF5996",
  Analytics:  "#7a73ff",
};

interface TemplateCardProps {
  template: AppTemplate;
}

function TemplateCard({ template }: TemplateCardProps) {
  const complexity = complexityConfig[template.complexity];
  const categoryColor = categoryColors[template.category] ?? "#8892A4";

  return (
    <article className="glass group flex w-72 shrink-0 flex-col gap-4 p-6 transition-all duration-200 hover:border-white/20 hover:shadow-xl hover:shadow-[#635BFF]/5 sm:w-80">
      {/* Category + complexity */}
      <div className="flex items-center justify-between">
        <span className="rounded-md px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: `${categoryColor}18`, color: categoryColor }}>
          {template.category}
        </span>
        <span className="rounded-md px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: complexity.bg, color: complexity.color }}>
          {complexity.label}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-white">{template.name}</h3>

      {/* Description */}
      <p className="flex-1 text-sm leading-relaxed text-[#8892A4]">
        {template.description}
      </p>

      {/* Component count hint */}
      <div className="flex items-center gap-1.5 text-xs text-[#8892A4]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        {template.schemaDefaults.components.length} components
      </div>

      {/* CTA */}
      <Link href={`/generate?template=${template.slug}`}
        className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] transition-all group-hover:gap-2.5">
        Use Template
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  );
}

interface TemplatesShowcaseProps {
  templates: AppTemplate[];
}

export function TemplatesShowcase({ templates }: TemplatesShowcaseProps) {
  return (
    <section id="templates" className="py-24">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#635BFF]">Templates</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start from a template.
            </h2>
          </div>
          <Link href="/templates"
            className="shrink-0 text-sm font-medium text-[#8892A4] transition-colors hover:text-white">
            Browse all →
          </Link>
        </div>
      </div>

      {/* Horizontal scroll row — extends to screen edges */}
      <div className="scrollbar-hide flex gap-5 overflow-x-auto px-6 pb-4 md:px-[max(1.5rem,calc((100vw-80rem)/2))]">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
}
