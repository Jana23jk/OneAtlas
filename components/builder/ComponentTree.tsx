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
        return <Table2 size={16} className="text-[#7A73FF]" />;
      case "metric":
        return <TrendingUp size={16} className="text-[#FFB17A]" />;
      case "chart":
        return <BarChart3 size={16} className="text-[#FFB17A]" />;
      case "form":
        return <ClipboardList size={16} className="text-[#7A73FF]" />;
      case "list":
        return <List size={16} className="text-[#7A73FF]" />;
      default:
        return <Box size={16} className="text-[#98A2B3]" />;
    }
  };

  const sortedComponents = schema
    ? [...schema.components].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="flex h-full flex-col border-r border-[#E7EAF5] bg-white">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#E7EAF5] px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#667085]">
          Components
        </h2>
        <button
          type="button"
          onClick={toggleLeft}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7EAF5] text-[#667085] transition-all hover:border-[#7A73FF]/30 hover:bg-[rgba(122, 115, 255,0.08)] hover:text-[#7A73FF]"
          title="Collapse Panel"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-4">
        {sortedComponents.map((comp) => {
          const isSelected = comp.id === selectedComponentId;
          return (
            <button
              key={comp.id}
              type="button"
              onClick={() => setSelectedComponentId(comp.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-300",
                isSelected
                  ? "border-[#7A73FF]/40 bg-[rgba(122, 115, 255,0.1)] text-[#7A73FF] shadow-soft"
                  : "border-transparent text-[#667085] hover:border-[#E7EAF5] hover:bg-[#FAFBFF] hover:text-[#1A1F36]",
              )}
            >
              {getIcon(comp.type)}
              <span className="truncate">{comp.name}</span>
            </button>
          );
        })}
        {sortedComponents.length === 0 && (
          <p className="py-6 text-center text-sm text-[#667085]">No components</p>
        )}
      </div>
    </div>
  );
}
