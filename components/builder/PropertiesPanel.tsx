"use client";

import { useEffect } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { ChevronRight, Settings, History, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PropertiesPanel() {
  const appId = useBuilderStore((state) => state.appId);
  const schema = useBuilderStore((state) => state.schema);
  const selectedId = useBuilderStore((state) => state.selectedComponentId);
  const history = useBuilderStore((state) => state.history);
  const setHistory = useBuilderStore((state) => state.setHistory);
  const toggleRight = useBuilderStore((state) => state.toggleRight);

  useEffect(() => {
    if (!appId) return;
    fetch(`/api/apps/${appId}/history`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.mutations) {
          setHistory(data.data.mutations);
        }
      })
      .catch((err) => console.error("Error loading history:", err));
  }, [appId, setHistory]);

  const selectedComponent = schema?.components.find((c) => c.id === selectedId);

  const getFormatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "00:00";
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden border-l border-[#E7EAF5] bg-white">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#E7EAF5] px-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#667085]">
          Properties
        </h2>
        <button
          type="button"
          onClick={toggleRight}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7EAF5] text-[#667085] transition-all hover:border-[#635BFF]/30 hover:bg-[rgba(99, 91, 255,0.08)] hover:text-[#635BFF]"
          title="Collapse Panel"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto p-5">
        {selectedComponent ? (
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Settings size={16} className="text-[#635BFF]" />
                <h3 className="text-lg font-bold text-[#1A1F36]">
                  {selectedComponent.name}
                </h3>
              </div>
              <p className="text-sm text-[#667085]">
                Component type:{" "}
                <span className="font-medium capitalize text-[#1A1F36]">
                  {selectedComponent.type}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Fields ({selectedComponent.fields.length})
              </p>
              <div className="space-y-2">
                {selectedComponent.fields.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-xl border border-[#E7EAF5] bg-[#FAFBFF] px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-[#1A1F36]">{f.name}</span>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {f.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-card border border-dashed border-[#E7EAF5] bg-[#FAFBFF] px-4 py-8 text-center">
            <p className="text-sm text-[#667085]">
              Select a component on the canvas to view its properties.
            </p>
          </div>
        )}

        <hr className="border-[#E7EAF5]" />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#635BFF]" />
            <h3 className="text-lg font-bold text-[#1A1F36]">Edit history</h3>
          </div>

          <div className="space-y-3">
            {history.length > 0 ? (
              [...history].reverse().map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-[#E7EAF5] bg-white p-4 shadow-soft transition-shadow hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-relaxed text-[#1A1F36] line-clamp-2">
                      {log.instruction}
                    </p>
                    {log.success ? (
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#635BFF]" />
                    ) : (
                      <XCircle size={14} className="mt-0.5 shrink-0 text-[#1A1F36]" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#98A2B3]">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {getFormatTime(log.createdAt)}
                    </span>
                    <span className="font-mono">v{log.schemaVersionAfter}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-[#667085]">No edits yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesPanel;
