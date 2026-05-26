import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AppTemplate } from "@/types/app";
import { Eye } from "lucide-react";

interface TemplateCardProps {
  template: AppTemplate;
  onPreview: (template: AppTemplate) => void;
}

const complexityVariant: Record<
  AppTemplate["complexity"],
  "success" | "warning" | "cta"
> = {
  SIMPLE: "success",
  MODERATE: "warning",
  ADVANCED: "cta",
};

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="default">{template.category}</Badge>
          <Badge variant={complexityVariant[template.complexity]}>
            {template.complexity}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-text-primary">{template.name}</h3>

        <p className="line-clamp-2 min-h-[40px] text-sm leading-relaxed text-text-secondary">
          {template.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-surface-border bg-surface-bg px-2 py-0.5 text-[10px] font-medium text-text-secondary"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onPreview(template)}
          aria-label={`Preview details for ${template.name}`}
        >
          <Eye size={14} /> Preview
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link
            href={`/generate?template=${template.slug}`}
            aria-label={`Use template ${template.name}`}
          >
            Use Template
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export default TemplateCard;
