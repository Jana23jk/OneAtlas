"use client";

import { useBuilderStore } from "@/store/builderStore";
import type { SchemaComponent, AppSchema } from "@/types/app";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AppCanvasProps {
  schema?: AppSchema | null;
  readOnly?: boolean;
}

export function AppCanvas({ schema: propSchema, readOnly = false }: AppCanvasProps = {}) {
  const storeSchema = useBuilderStore((state) => state.schema);
  const schema = propSchema !== undefined ? propSchema : storeSchema;

  const storeSelectedId = useBuilderStore((state) => state.selectedComponentId);
  const storeSetSelected = useBuilderStore((state) => state.setSelectedComponentId);
  const leftCollapsed = useBuilderStore((state) => state.leftCollapsed);
  const rightCollapsed = useBuilderStore((state) => state.rightCollapsed);
  const toggleLeft = useBuilderStore((state) => state.toggleLeft);
  const toggleRight = useBuilderStore((state) => state.toggleRight);

  const selectedId = readOnly ? null : storeSelectedId;
  const setSelected = readOnly ? () => {} : storeSetSelected;

  const getDummy = (name: string, type: string, index: number) => {
    const key = name.toLowerCase();
    if (type === "number") return index === 0 ? "1,200" : index === 1 ? "4,500" : "850";
    if (type === "date") return index === 0 ? "2026-05-01" : index === 1 ? "2026-05-15" : "2026-05-26";
    if (type === "boolean") return index % 2 === 0 ? "Yes" : "No";
    if (key.includes("email")) return index === 0 ? "dan@abc.com" : index === 1 ? "sarah@xyz.com" : "rob@net.org";
    if (key.includes("phone")) return `+1 (555) 012-34${index}6`;
    if (key.includes("status")) return index === 0 ? "Active" : index === 1 ? "Pending" : "Completed";
    if (key.includes("role")) return index === 0 ? "Admin" : index === 1 ? "Editor" : "Viewer";
    return index === 0 ? "Acme Corp" : index === 1 ? "Beta Inc" : "Gamma LLC";
  };

  const renderTable = (comp: SchemaComponent) => (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table">
        <thead>
          <tr>
            {comp.fields.map((f) => (
              <th key={f.id}>{f.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((i) => (
            <tr key={i}>
              {comp.fields.map((f) => (
                <td key={f.id}>
                  <span className="font-medium text-[#1A1F36]">
                    {getDummy(f.name, f.type, i)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMetric = (comp: SchemaComponent) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {comp.fields.map((f, i) => (
        <div
          key={f.id}
          className="rounded-card border border-[#E7EAF5] bg-[#FAFBFF] p-5 transition-shadow hover:shadow-soft"
        >
          <span className="block truncate text-xs font-semibold uppercase tracking-wider text-[#667085]">
            {f.name}
          </span>
          <span className="mt-2 block text-2xl font-bold text-[#1A1F36]">
            {f.type === "number" ? `${(i + 1) * 425}` : "Active"}
          </span>
          <span className="mt-1 block text-xs font-medium text-[#7A73FF]">
            ↑ 12% vs last month
          </span>
        </div>
      ))}
    </div>
  );

  const renderChart = (comp: SchemaComponent) => (
    <div className="rounded-card border border-[#E7EAF5] bg-white p-5">
      <div className="flex h-44 items-end justify-between gap-2 border-b border-[#E7EAF5] pb-3">
        {[40, 75, 55, 90, 60, 85].map((h, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              style={{ height: `${h}%` }}
              className="w-full rounded-t bg-gradient-to-t from-[#7A73FF] to-[#6B64E8] opacity-90 transition-opacity hover:opacity-100"
            />
            <span className="font-mono text-[10px] text-[#98A2B3]">Q{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-[#667085]">
        <span>Axis: {comp.fields[0]?.name || "X"}</span>
        <span>Value: {comp.fields[1]?.name || "Y"}</span>
      </div>
    </div>
  );

  const renderForm = (comp: SchemaComponent) => (
    <div className="grid gap-4 rounded-card border border-[#E7EAF5] bg-[#FAFBFF] p-6 sm:grid-cols-2">
      {comp.fields.map((f) => (
        <div key={f.id} className="flex flex-col gap-2">
          <label className="text-sm font-semibold capitalize text-[#1A1F36]">
            {f.name}
          </label>
          <input
            disabled
            type="text"
            placeholder={f.type === "date" ? "YYYY-MM-DD" : `Enter ${f.name}`}
            className="input-premium w-full text-sm"
          />
        </div>
      ))}
    </div>
  );

  const renderList = (comp: SchemaComponent) => (
    <ul className="divide-y divide-[#E7EAF5] overflow-hidden rounded-card border border-[#E7EAF5] bg-white">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex items-center gap-3 p-4 transition-colors hover:bg-[#F4F5FF]"
        >
          <div className="h-2 w-2 shrink-0 rounded-full bg-[#7A73FF]" />
          <div className="flex flex-1 flex-wrap justify-between gap-3 text-sm">
            {comp.fields.slice(0, 3).map((f) => (
              <span key={f.id} className="text-[#1A1F36]">
                <span className="font-medium text-[#667085] capitalize">{f.name}:</span>{" "}
                {getDummy(f.name, f.type, i)}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );

  const sorted = schema ? [...schema.components].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="relative flex-1 overflow-y-auto p-8 pb-36 animate-fade-in-up">
      {!readOnly && (
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {leftCollapsed && (
            <button
              type="button"
              onClick={toggleLeft}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7EAF5] bg-white text-[#667085] shadow-soft transition-all hover:border-[#7A73FF]/30 hover:text-[#7A73FF]"
              title="Expand Components Panel"
            >
              <PanelLeftOpen size={16} />
            </button>
          )}
          {rightCollapsed && (
            <button
              type="button"
              onClick={toggleRight}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7EAF5] bg-white text-[#667085] shadow-soft transition-all hover:border-[#7A73FF]/30 hover:text-[#7A73FF]"
              title="Expand Properties Panel"
            >
              <PanelRightOpen size={16} />
            </button>
          )}
        </div>
      )}

      <div className="mx-auto max-w-4xl space-y-8">
        {sorted.length === 0 && (
          <p className="text-center text-sm text-[#667085]">No components in schema yet.</p>
        )}
        {sorted.map((comp) => {
          const isSelected = !readOnly && comp.id === selectedId;
          return (
            <section
              key={comp.id}
              onClick={
                readOnly
                  ? undefined
                  : (e) => {
                      e.stopPropagation();
                      setSelected(comp.id);
                    }
              }
              className={cn(
                "dashboard-card group",
                !readOnly && "cursor-pointer",
                isSelected && "dashboard-card-selected",
              )}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1A1F36] transition-colors group-hover:text-[#7A73FF]">
                    {comp.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-[#98A2B3]">{comp.id}</p>
                </div>
                <Badge variant="outline" className="shrink-0 uppercase">
                  {comp.type}
                </Badge>
              </div>

              {comp.type === "table" && renderTable(comp)}
              {comp.type === "metric" && renderMetric(comp)}
              {comp.type === "chart" && renderChart(comp)}
              {comp.type === "form" && renderForm(comp)}
              {comp.type === "list" && renderList(comp)}
            </section>
          );
        })}
      </div>
    </div>
  );
}
