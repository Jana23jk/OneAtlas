import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AppTemplate } from "@/types/app";
import { Eye } from "lucide-react";

interface TemplateCardProps {
  template: AppTemplate;
  onPreview: (template: AppTemplate) => void;
}

const complexityBadgeColors: Record<AppTemplate["complexity"], { bg: string; text: string; border: string }> = {
  SIMPLE: { bg: "bg-emerald-500/10", text: "text-[#00D4B1]", border: "border-emerald-500/20" },
  MODERATE: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  ADVANCED: { bg: "bg-rose-500/10", text: "text-[#FF5996]", border: "border-rose-500/20" },
};

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const complexityStyle = complexityBadgeColors[template.complexity] || {
    bg: "bg-white/5",
    text: "text-white/70",
    border: "border-white/10",
  };

  return (
    <article className="card p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:border-white/20 shadow-lg">
      <div className="space-y-3">
        {/* Header Tag and Complexity */}
        <div className="flex items-center justify-between">
          <span className="rounded bg-[#635BFF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {template.category}
          </span>
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${complexityStyle.bg} ${complexityStyle.text} ${complexityStyle.border}`}
          >
            {template.complexity}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white tracking-tight">{template.name}</h3>

        {/* Description (2 lines max, ellipsis) */}
        <p className="text-sm text-white/60 line-clamp-2 leading-relaxed min-h-[40px]">
          {template.description}
        </p>

        {/* Tag chips (first 3 shown) */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40 border border-white/[0.03]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={() => onPreview(template)}
          variant="ghost"
          size="sm"
          className="flex-1 h-9 gap-1.5 text-white/60 hover:text-white hover:bg-white/5 border border-white/10"
          aria-label={`Preview details for ${template.name}`}
        >
          <Eye size={14} /> Preview
        </Button>
        <Link href={`/generate?template=${template.slug}`} className="flex-1 shrink-0">
          <Button
            size="sm"
            className="w-full h-9 bg-[#635BFF] hover:bg-[#7a73ff] text-white font-semibold"
            aria-label={`Use template ${template.name}`}
          >
            Use Template
          </Button>
        </Link>
      </div>
    </article>
  );
}

export default TemplateCard;
