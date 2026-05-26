"use client";

import { useBuilderStore } from "@/store/builderStore";
import { Table2, TrendingUp, BarChart3, ClipboardList, List, Box, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComponentTree() {
  const schema = useBuilderStore((state) => state.schema);
  const selectedComponentId = useBuilderStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useBuilderStore((state) => state.setSelectedComponentId);
  const toggleLeft = useBuilderStore((state) => state.toggleLeft);

  const getIcon = (type: string) => {
    switch (type) {
      case "table":
        return <Table2 size={16} className="text-brand-teal" />;
      case "metric":
        return <TrendingUp size={16} className="text-brand-yellow" />;
      case "chart":
        return <BarChart3 size={16} className="text-brand-pink" />;
      case "form":
        return <ClipboardList size={16} className="text-brand-primary" />;
      case "list":
        return <List size={16} className="text-brand-cyan" />;
      default:
        return <Box size={16} className="text-text-secondary" />;
    }
  };

  const sortedComponents = schema
    ? [...schema.components].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-surface-border px-4">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          Components
        </span>
        <button
          type="button"
          onClick={toggleLeft}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-surface-border text-text-secondary transition-all hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary"
          title="Collapse Panel"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        {sortedComponents.map((comp) => {
          const isSelected = comp.id === selectedComponentId;
          return (
            <button
              key={comp.id}
              type="button"
              onClick={() => setSelectedComponentId(comp.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-all duration-300",
                isSelected
                  ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                  : "border-transparent text-text-secondary hover:border-surface-border hover:bg-surface-bg hover:text-text-primary",
              )}
            >
              {getIcon(comp.type)}
              <span className="truncate">{comp.name}</span>
            </button>
          );
        })}
        {sortedComponents.length === 0 && (
          <p className="py-4 text-center text-xs italic text-text-secondary">
            No components
          </p>
        )}
      </div>
    </div>
  );
}
