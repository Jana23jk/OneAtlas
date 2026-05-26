"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SchemaPreview } from "@/components/builder/SchemaPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight } from "lucide-react";
import type { AppTemplate } from "@/types/app";

interface TemplateModalProps {
  template: AppTemplate;
  onClose: () => void;
}

export function TemplateModal({ template, onClose }: TemplateModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="glass-panel relative flex max-h-[90vh] w-full max-w-4xl animate-modal-in flex-col gap-6 overflow-y-auto p-6 md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge>{template.category}</Badge>
              <Badge variant="outline">{template.complexity}</Badge>
            </div>
            <h2 id="modal-title" className="text-2xl font-bold text-text-primary">
              {template.name}
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {template.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-surface-border bg-surface-bg px-2 py-0.5 text-xs text-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" asChild>
              <Link href={`/generate?template=${template.slug}`}>
                Use This Template <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="max-h-[60vh] flex-1 overflow-y-auto md:max-h-full">
          <SchemaPreview schema={template.schemaDefaults} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-text-secondary transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
          aria-label="Close template preview"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default TemplateModal;
