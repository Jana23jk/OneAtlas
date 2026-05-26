"use client";

import { useBuilderStore } from "@/store/builderStore";
import type { SchemaComponent, AppSchema } from "@/types/app";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

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
    <div className="overflow-x-auto rounded-lg border border-white/5 bg-black/25">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-[#8892A4] font-semibold">
            {comp.fields.map((f) => (
              <th key={f.id} className="p-3 capitalize">{f.name}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/80">
          {[0, 1, 2].map((i) => (
            <tr key={i} className="hover:bg-white/[0.02]">
              {comp.fields.map((f) => (
                <td key={f.id} className="p-3 font-mono text-[11px]">
                  {getDummy(f.name, f.type, i)}
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
        <div key={f.id} className="rounded-lg border border-white/5 bg-black/20 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8892A4] block truncate">
            {f.name}
          </span>
          <span className="mt-1 text-2xl font-bold text-white block">
            {f.type === "number" ? `${(i + 1) * 425}` : "Active"}
          </span>
          <span className="text-[10px] text-[#00D4B1] mt-0.5 block">↑ 12% vs last month</span>
        </div>
      ))}
    </div>
  );

  const renderChart = (comp: SchemaComponent) => (
    <div className="rounded-lg border border-white/5 bg-black/20 p-4">
      <div className="h-44 w-full flex items-end justify-between gap-2 pb-2 border-b border-white/10">
        {[40, 75, 55, 90, 60, 85].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div
              style={{ height: `${h}%` }}
              className="w-full rounded-t bg-gradient-to-t from-[#635BFF] to-[#00D4B1] opacity-75 hover:opacity-100 transition-opacity"
            />
            <span className="text-[9px] text-white/40 font-mono">Q{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-[#8892A4]">
        <span>Axis: {comp.fields[0]?.name || "X"}</span>
        <span>Value: {comp.fields[1]?.name || "Y"}</span>
      </div>
    </div>
  );

  const renderForm = (comp: SchemaComponent) => (
    <div className="grid gap-4 sm:grid-cols-2 rounded-lg border border-white/5 bg-black/20 p-6">
      {comp.fields.map((f) => (
        <div key={f.id} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/70 capitalize">{f.name}</label>
          <input
            disabled
            type="text"
            placeholder={f.type === "date" ? "YYYY-MM-DD" : `Enter ${f.name}`}
            className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 w-full"
          />
        </div>
      ))}
    </div>
  );

  const renderList = (comp: SchemaComponent) => (
    <ul className="divide-y divide-white/5 rounded-lg border border-white/5 bg-black/20">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-center gap-3 p-3 hover:bg-white/[0.01]">
          <div className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
          <div className="flex-1 flex justify-between gap-4 text-xs">
            {comp.fields.slice(0, 3).map((f) => (
              <span key={f.id} className="text-white/80">
                <strong className="text-[#8892A4] font-medium capitalize">{f.name}:</strong>{" "}
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
    <div className="flex-1 overflow-y-auto p-8 pb-32">
      {/* Sidebar toggle buttons */}
      {!readOnly && (
        <div className="absolute left-4 top-4 flex gap-2 z-10">
          {leftCollapsed && (
            <button
              onClick={toggleLeft}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0A2540] text-white/60 hover:text-white hover:bg-white/5 transition-all shadow-md"
              title="Expand Components Panel"
              aria-label="Expand components panel"
            >
              <PanelLeftOpen size={16} />
            </button>
          )}
          {rightCollapsed && (
            <button
              onClick={toggleRight}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0A2540] text-white/60 hover:text-white hover:bg-white/5 transition-all shadow-md absolute left-[calc(100vw-110px)] md:left-auto md:relative"
              title="Expand Properties Panel"
              aria-label="Expand properties panel"
            >
              <PanelRightOpen size={16} />
            </button>
          )}
        </div>
      )}

      <div className="mx-auto max-w-4xl space-y-6">
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
              className={`group rounded-xl bg-[#1a1f36]/40 p-6 transition-all duration-300 ${
                readOnly ? "" : "cursor-pointer"
              } ${
                isSelected
                  ? "border-2 border-[#635BFF] shadow-lg shadow-[#635BFF]/10"
                  : "border border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[#8a84ff] transition-colors">
                    {comp.name}
                  </h3>
                  <span className="text-[10px] text-white/40 font-mono">{comp.id}</span>
                </div>
                <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  {comp.type}
                </span>
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
