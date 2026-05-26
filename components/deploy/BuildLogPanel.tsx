"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogLine {
  level: "info" | "success" | "warn" | "error" | "muted";
  text: string;
}

const levelColors: Record<LogLine["level"], string> = {
  info: "#635BFF",
  success: "#00D4B1",
  warn: "#F8BC42",
  error: "#FF5996",
  muted: "rgba(255,255,255,0.7)",
};

interface BuildLogPanelProps {
  lines: LogLine[];
  title?: string;
}

export function BuildLogPanel({ lines, title = "Build logs" }: BuildLogPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const rawText = lines.map((l) => l.text).join("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard-card overflow-hidden p-0 reveal">
      <div className="flex items-center justify-between border-b border-[#E7EAF5] px-5 py-4">
        <div>
          <h3 className="text-lg font-bold text-[#1A1F36]">{title}</h3>
          <p className="text-sm text-[#667085]">Live output from the latest build pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-[#E7EAF5] bg-white px-3 py-1.5 text-xs font-medium text-[#667085] transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
          >
            {copied ? <Check size={14} className="text-brand-primary" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 rounded-lg border border-[#E7EAF5] bg-white px-3 py-1.5 text-xs font-medium text-[#667085] transition-colors hover:bg-[#FAFBFF]"
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      <div
        className={cn(
          "build-log-terminal transition-all duration-300",
          expanded ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 overflow-hidden",
        )}
      >
        <div className="max-h-[380px] overflow-y-auto p-5">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-3 py-0.5">
              <span className="log-muted w-8 shrink-0 select-none text-right text-[11px]">
                {String(i + 1).padStart(3, "0")}
              </span>
              <span style={{ color: levelColors[line.level] }}>{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
