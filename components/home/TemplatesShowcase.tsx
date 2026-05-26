import Link from "next/link";
import type { AppTemplate } from "@/types/app";

const complexityConfig: Record<AppTemplate["complexity"], { label: string; color: string; bg: string }> = {
  SIMPLE:   { label: "Simple",   color: "#F8BC42", bg: "rgba(248, 188, 66,0.12)"  },
  MODERATE: { label: "Moderate", color: "#F8BC42", bg: "rgba(248,188,66,0.12)" },
  ADVANCED: { label: "Advanced", color: "#FF5996", bg: "rgba(255, 89, 150,0.12)" },
};

const categoryColors: Record<string, string> = {
  CRM:        "#F8BC42",
  HR:         "#F8BC42",
  Admin:      "#FF5996",
  Operations: "#FF5996",
  Analytics:  "#F8BC42",
};

interface TemplateCardProps {
  template: AppTemplate;
}

function TemplateCard({ template }: TemplateCardProps) {
  const complexity = complexityConfig[template.complexity];
  const categoryColor = categoryColors[template.category] ?? "#8892A4";

  return (
    <article className="group flex w-72 shrink-0 flex-col gap-4 p-6 bg-white border border-[#F8BC42]/10 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-[#F8BC42]/4 hover:border-[#F8BC42]/20 hover:-translate-y-1 transition-all duration-300 sm:w-80">
      {/* Category + complexity */}
      <div className="flex items-center justify-between">
        <span className="rounded-md px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: `${categoryColor}12`, color: categoryColor }}>
          {template.category}
        </span>
        <span className="rounded-md px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: complexity.bg, color: complexity.color }}>
          {complexity.label}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-base font-bold text-[#1A1F36]">{template.name}</h3>

      {/* Description */}
      <p className="flex-1 text-sm leading-relaxed text-[#667085]">
        {template.description}
      </p>

      {/* Component count hint */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        {template.schemaDefaults.components.length} components
      </div>

      {/* CTA */}
      <Link href={`/generate?template=${template.slug}`}
        className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#F8BC42] transition-all group-hover:gap-2.5">
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

export function TemplatesShowcase({ templates, id = "templates" }: TemplatesShowcaseProps & { id?: string }) {
  return (
    <section id={id} className="py-24">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#F8BC42] bg-[#F8BC42]/5 px-3 py-1 rounded-full">
              Templates
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1F36] sm:text-4xl">
              Start from a template.
            </h2>
          </div>
          <Link href="/templates"
            className="shrink-0 text-sm font-semibold text-[#667085] transition-colors hover:text-[#F8BC42]">
            Browse all →
          </Link>
        </div>
      </div>

      {/* Horizontal scroll row — extends to screen edges */}
      <div className="scrollbar-hide flex gap-6 overflow-x-auto px-6 pb-4 md:px-[max(1.5rem,calc((100vw-80rem)/2))]">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
}
