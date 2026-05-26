"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SchemaPreview } from "@/components/builder/SchemaPreview";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import type { AppTemplate } from "@/types/app";

interface TemplateModalProps {
  template: AppTemplate;
  onClose: () => void;
}

export function TemplateModal({ template, onClose }: TemplateModalProps) {
  // ESC key dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-4xl rounded-xl border border-white/[0.08] bg-[#0c1b2e] p-6 shadow-2xl animate-fade-in-up flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
        {/* Left Column: Details */}
        <div className="flex-1 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Header category + complexity */}
            <div className="flex items-center gap-3">
              <span className="rounded bg-[#635BFF] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                {template.category}
              </span>
              <span className="rounded bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white/70">
                {template.complexity}
              </span>
            </div>

            <h2 id="modal-title" className="text-2xl font-bold text-white">
              {template.name}
            </h2>

            <p className="text-sm text-white/70 leading-relaxed">{template.description}</p>

            {/* Tags */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-white/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
              aria-label="Close template preview modal"
            >
              Cancel
            </Button>
            <Link href={`/generate?template=${template.slug}`} className="flex-1">
              <Button
                className="w-full bg-[#635BFF] hover:bg-[#7a73ff] text-white flex items-center justify-center gap-2 font-semibold"
                aria-label="Create app using this template"
              >
                Use This Template <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Schema Preview Component */}
        <div className="flex-1 max-h-[60vh] md:max-h-full overflow-y-auto">
          <SchemaPreview schema={template.schemaDefaults} />
        </div>

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white transition-all hover:bg-white/5"
          aria-label="Close template preview"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default TemplateModal;
