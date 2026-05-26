"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { Send, CornerDownLeft, AlertCircle, RefreshCw } from "lucide-react";
import type { ApiResponse, EditResponse } from "@/types/api";
import type { MutationLogEntry } from "@/types/app";

export function ConversationalInput() {
  const appId = useBuilderStore((state) => state.appId);
  const schema = useBuilderStore((state) => state.schema);
  const setSchema = useBuilderStore((state) => state.setSchema);
  const setHistory = useBuilderStore((state) => state.setHistory);
  const addHistoryEntry = useBuilderStore((state) => state.addHistoryEntry);
  const updateHistoryEntry = useBuilderStore((state) => state.updateHistoryEntry);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const syncHistory = async () => {
    try {
      const res = await fetch(`/api/apps/${appId}/history`);
      const data = await res.json();
      if (data?.data?.mutations) {
        setHistory(data.data.mutations);
      }
    } catch (err) {
      console.error("Error syncing history:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !appId) return;

    const userInstruction = input.trim();
    setInput("");
    setLoading(true);
    setErrorMsg(null);

    // 1. Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempEntry: MutationLogEntry = {
      id: tempId,
      instruction: userInstruction,
      mutationType: "pending",
      resultSummary: "Processing instruction...",
      success: true,
      schemaVersionAfter: schema ? schema.version : 1,
      createdAt: new Date().toISOString(),
    };
    addHistoryEntry(tempEntry);

    try {
      const res = await fetch(`/api/apps/${appId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction: userInstruction }),
      });

      const json: ApiResponse<EditResponse> = await res.json();

      if (!res.ok || json.error) {
        const errText = json.error?.message || "Failed to parse command";
        setErrorMsg(errText);
        updateHistoryEntry(tempId, {
          success: false,
          resultSummary: errText,
        });
      } else if (json.data) {
        // Success
        setSchema(json.data.schema);
        updateHistoryEntry(tempId, {
          id: `log-${Date.now()}`,
          mutationType: json.data.mutation.type,
          resultSummary: json.data.resultSummary,
          schemaVersionAfter: json.data.versionAfter,
        });
        // Sync full history from DB to ensure timestamps are exact
        await syncHistory();
      }
    } catch (err) {
      console.error("API error editing app:", err);
      const msg = "Network error. Try again.";
      setErrorMsg(msg);
      updateHistoryEntry(tempId, {
        success: false,
        resultSummary: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async () => {
    if (loading || !appId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/apps/${appId}/undo`, {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok || json.error) {
        setErrorMsg(json.error?.message || "Nothing to undo");
      } else if (json.data) {
        setSchema(json.data.schema);
        await syncHistory();
      }
    } catch (err) {
      console.error("Undo error:", err);
      setErrorMsg("Failed to undo last modification");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const canUndo = schema && schema.version > 1;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[640px] z-20 flex flex-col gap-2">
      {/* Error Popup */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-950/90 p-3 text-xs text-red-300 shadow-xl animate-fade-in-up">
          <AlertCircle size={14} className="shrink-0" />
          <span className="flex-1 leading-relaxed">{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-red-300/60 hover:text-red-300 font-bold px-1"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Action Bar */}
      <div className="mx-4 mb-4 flex items-center gap-2.5 rounded-card border border-surface-border bg-white/95 p-2 shadow-card backdrop-blur-xl">
        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={!canUndo || loading}
          className="h-9 px-3 rounded-lg border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-white/80 hover:text-white shrink-0"
          title="Undo last change"
        >
          <CornerDownLeft size={13} />
          <span>Undo</span>
        </button>

        <div className="h-5 w-[1px] bg-white/10 shrink-0" />

        {/* Input area */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          placeholder="Tell me how to edit this app... e.g. 'Add a status field to contacts'"
          className="flex-1 border-none bg-transparent px-1 py-1 text-sm text-text-primary outline-none placeholder:text-text-secondary disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="h-9 w-9 rounded-lg bg-[#635BFF] flex items-center justify-center text-white hover:bg-[#7a73ff] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
          aria-label="Send instruction"
        >
          {loading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
        </button>
      </div>
    </div>
  );
}
export default ConversationalInput;
