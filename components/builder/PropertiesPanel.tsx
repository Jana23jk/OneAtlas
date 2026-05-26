"use client";

import { useEffect } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { ChevronRight, Settings, History, CheckCircle2, XCircle, Clock } from "lucide-react";

export function PropertiesPanel() {
  const appId = useBuilderStore((state) => state.appId);
  const schema = useBuilderStore((state) => state.schema);
  const selectedId = useBuilderStore((state) => state.selectedComponentId);
  const history = useBuilderStore((state) => state.history);
  const setHistory = useBuilderStore((state) => state.setHistory);
  const toggleRight = useBuilderStore((state) => state.toggleRight);

  // Sync edit history from server on mount
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
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "00:00";
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header section with Collapse Toggle */}
      <div className="flex h-12 items-center justify-between border-b border-white/[0.08] px-4 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8892A4]">
          Properties
        </span>
        <button
          onClick={toggleRight}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white transition-all hover:bg-white/5"
          title="Collapse Panel"
          aria-label="Collapse properties panel"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Main properties detail */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {selectedComponent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/90">
              <Settings size={14} className="text-[#635BFF]" />
              <h3 className="text-sm font-semibold">{selectedComponent.name}</h3>
            </div>

            {/* Field definitions list */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8892A4]">
                Fields ({selectedComponent.fields.length})
              </span>
              <div className="space-y-1.5">
                {selectedComponent.fields.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2 text-xs"
                  >
                    <span className="font-medium text-white/80">{f.name}</span>
                    <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[9px] font-mono uppercase text-white/50">
                      {f.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs italic text-white/30 py-4 text-center">
            No component selected. Click a component in the canvas to see properties.
          </p>
        )}

        <hr className="border-white/[0.08]" />

        {/* Edit History Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/90">
            <History size={14} className="text-[#00D4B1]" />
            <h3 className="text-sm font-semibold">Edit History</h3>
          </div>

          <div className="space-y-2.5">
            {history.length > 0 ? (
              [...history].reverse().map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-white/5 bg-white/[0.01] p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-white/70 line-clamp-2 leading-relaxed">
                      {log.instruction}
                    </span>
                    {/* Status dot */}
                    {log.success ? (
                      <CheckCircle2 size={12} className="text-[#00D4B1] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={12} className="text-red-400 shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {getFormatTime(log.createdAt)}
                    </span>
                    <span className="font-mono text-[9px]">v{log.schemaVersionAfter}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs italic text-white/30 text-center py-4">No mutations log</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default PropertiesPanel;
