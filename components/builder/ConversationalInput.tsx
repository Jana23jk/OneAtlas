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
        setSchema(json.data.schema);
        updateHistoryEntry(tempId, {
          id: `log-${Date.now()}`,
          mutationType: json.data.mutation.type,
          resultSummary: json.data.resultSummary,
          schemaVersionAfter: json.data.versionAfter,
        });
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
      const res = await fetch(`/api/apps/${appId}/undo`, { method: "POST" });
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

  const canUndo = schema && schema.version > 1;

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex justify-center px-6 pb-6 pt-4">
      <div className="pointer-events-auto flex w-full max-w-[680px] flex-col gap-2">
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-card border border-brand-accent/40 bg-brand-accent/15 px-4 py-3 text-sm text-[#1A1F36] shadow-soft animate-fade-in-up">
            <AlertCircle size={16} className="shrink-0 text-brand-accent" />
            <span className="flex-1">{errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="font-bold text-brand-primary hover:text-brand-primary-hover"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div className="builder-chat-bar flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo || loading}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-[#E7EAF5] bg-[#FAFBFF] px-3 text-sm font-semibold text-[#667085] transition-all hover:border-[#7A73FF]/30 hover:text-[#7A73FF] disabled:pointer-events-none disabled:opacity-40"
          >
            <CornerDownLeft size={14} />
            Undo
          </button>

          <div className="h-6 w-px shrink-0 bg-[#E7EAF5]" />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            placeholder="Tell me how to edit this app… e.g. 'Add a status field to contacts'"
            className="min-w-0 flex-1 border-none bg-transparent text-sm text-[#1A1F36] outline-none placeholder:text-[#98A2B3] disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7A73FF] text-white shadow-primary transition-all hover:bg-[#6B64E8] hover:scale-105 disabled:pointer-events-none disabled:opacity-40 btn-lift"
            aria-label="Send instruction"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConversationalInput;
