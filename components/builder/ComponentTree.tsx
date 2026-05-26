"use client";

import { useBuilderStore } from "@/store/builderStore";
import { Table2, TrendingUp, BarChart3, ClipboardList, List, Box, ChevronLeft } from "lucide-react";

export function ComponentTree() {
  const schema = useBuilderStore((state) => state.schema);
  const selectedComponentId = useBuilderStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useBuilderStore((state) => state.setSelectedComponentId);
  const toggleLeft = useBuilderStore((state) => state.toggleLeft);

  const getIcon = (type: string) => {
    switch (type) {
      case "table":
        return <Table2 size={16} className="text-[#00D4B1]" />;
      case "metric":
        return <TrendingUp size={16} className="text-amber-400" />;
      case "chart":
        return <BarChart3 size={16} className="text-[#FF5996]" />;
      case "form":
        return <ClipboardList size={16} className="text-[#8a84ff]" />;
      case "list":
        return <List size={16} className="text-purple-400" />;
      default:
        return <Box size={16} className="text-white/60" />;
    }
  };

  const sortedComponents = schema ? [...schema.components].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="flex h-full flex-col bg-[#0A2540]">
      {/* Header section with Collapse Toggle */}
      <div className="flex h-12 items-center justify-between border-b border-white/[0.08] px-4 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8892A4]">
          Components
        </span>
        <button
          onClick={toggleLeft}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white transition-all hover:bg-white/5"
          title="Collapse Panel"
          aria-label="Collapse component panel"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {sortedComponents.map((comp) => {
          const isSelected = comp.id === selectedComponentId;
          return (
            <button
              key={comp.id}
              onClick={() => setSelectedComponentId(comp.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left ${
                isSelected
                  ? "bg-[#635BFF]/10 text-[#8a84ff] border border-[#635BFF]/20"
                  : "text-white/60 hover:text-white hover:bg-white/[0.02] border border-transparent"
              }`}
            >
              {getIcon(comp.type)}
              <span className="truncate">{comp.name}</span>
            </button>
          );
        })}
        {sortedComponents.length === 0 && (
          <p className="text-xs italic text-white/30 text-center py-4">No components</p>
        )}
      </div>
    </div>
  );
}
