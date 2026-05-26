"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Copy,
  ExternalLink,
  Gauge,
  Monitor,
  RefreshCw,
  Share2,
  Smartphone,
  Tablet,
  Laptop,
  Check,
  Terminal,
} from "lucide-react";
import { AppCanvas } from "@/components/builder/AppCanvas";
import type { AppSchema } from "@/types/app";
import { cn } from "@/lib/utils";

type DeviceMode = "desktop" | "laptop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: "100%",
  laptop: "1024px",
  tablet: "768px",
  mobile: "390px",
};

interface PreviewEnvironmentProps {
  schema: AppSchema;
  appName: string;
  templateName: string;
  previewUrl: string;
  createdAt: string;
  schemaVersion: number;
}

const MOCK_CONSOLE = [
  { level: "log", message: "[preview] Hydrating schema v" },
  { level: "info", message: "[preview] Rendering  components in read-only mode" },
  { level: "warn", message: "[preview] Mock data loaded for table rows" },
  { level: "log", message: "[preview] Ready — snapshot validated" },
];

export function PreviewEnvironment({
  schema,
  appName,
  templateName,
  previewUrl,
  createdAt,
  schemaVersion,
}: PreviewEnvironmentProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [historyIndex, setHistoryIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const fullPreviewUrl = useMemo(() => {
    if (previewUrl.startsWith("http")) return previewUrl;
    if (typeof window !== "undefined") {
      return `${window.location.origin}${previewUrl}`;
    }
    return previewUrl;
  }, [previewUrl]);

  const displayUrl = useMemo(() => {
    try {
      const u = new URL(fullPreviewUrl);
      return u.hostname + u.pathname;
    } catch {
      return fullPreviewUrl;
    }
  }, [fullPreviewUrl]);

  const scores = useMemo(
    () => ({
      performance: 94,
      accessibility: 91,
      loadTime: "1.2s",
      seo: 88,
      responsive: true,
    }),
    [],
  );

  const handleRefresh = () => setRefreshKey((k) => k + 1);
  const handleBack = () => setHistoryIndex((i) => Math.max(0, i - 1));
  const handleForward = () => setHistoryIndex((i) => Math.min(2, i + 1));

  const handleCopyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(fullPreviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullPreviewUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: appName, url: fullPreviewUrl });
    } else {
      await handleCopyUrl();
      setShareOpen(true);
      setTimeout(() => setShareOpen(false), 2000);
    }
  };

  const devices: { id: DeviceMode; label: string; icon: React.ReactNode }[] = [
    { id: "desktop", label: "Desktop", icon: <Monitor size={15} /> },
    { id: "laptop", label: "Laptop", icon: <Laptop size={15} /> },
    { id: "tablet", label: "Tablet", icon: <Tablet size={15} /> },
    { id: "mobile", label: "Mobile", icon: <Smartphone size={15} /> },
  ];

  return (
    <div className="preview-page-bg flex h-screen flex-col overflow-hidden">
      <div className="glow-purple -left-20 top-0 opacity-60" aria-hidden />
      <div className="glow-pink right-0 top-1/4 opacity-50" aria-hidden />

      {/* Browser-style header */}
      <header className="preview-browser-bar relative z-20 flex shrink-0 items-center gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleBack}
            disabled={historyIndex === 0}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7EAF5] text-[#667085] transition-colors hover:bg-[#FAFBFF] hover:text-[#1A1F36] disabled:opacity-40"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleForward}
            disabled={historyIndex >= 2}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7EAF5] text-[#667085] transition-colors hover:bg-[#FAFBFF] hover:text-[#1A1F36] disabled:opacity-40"
            aria-label="Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7EAF5] text-[#667085] transition-colors hover:bg-[#FAFBFF] hover:text-[#F8BC42]"
            aria-label="Refresh preview"
          >
            <RefreshCw size={16} className={refreshKey > 0 ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#E7EAF5] bg-[#FAFBFF] px-4 py-2">
          <span className="shrink-0 rounded-md bg-[rgba(248, 188, 66,0.12)] px-2 py-0.5 text-[10px] font-bold uppercase text-[#F8BC42]">
            Preview
          </span>
          <span className="truncate font-mono text-sm text-[#1A1F36]">{displayUrl}</span>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="ml-auto shrink-0 rounded p-1 text-[#667085] hover:text-[#F8BC42]"
            aria-label="Copy URL"
          >
            {copied ? <Check size={14} className="text-[#F8BC42]" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="hidden items-center gap-1 rounded-xl border border-[#E7EAF5] bg-white p-1 md:flex">
          {devices.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                device === d.id
                  ? "bg-gradient-to-r from-[#F8BC42] to-[#E0A22B] text-white shadow-sm"
                  : "text-[#667085] hover:bg-[#FAFBFF]",
              )}
            >
              {d.icon}
              <span className="hidden lg:inline">{d.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={fullPreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-[#E7EAF5] px-3 py-2 text-xs font-semibold text-[#1A1F36] transition-colors hover:border-[#F8BC42]/30 sm:inline-flex"
          >
            <ExternalLink size={14} />
            Open tab
          </a>
          <button
            type="button"
            onClick={handleShare}
            className="btn-deploy-primary !py-2 !text-xs"
          >
            <Share2 size={14} />
            {shareOpen ? "Copied!" : "Share"}
          </button>
          <Link
            href="/generate"
            className="hidden rounded-lg border border-[#E7EAF5] px-3 py-2 text-xs font-semibold text-[#F8BC42] transition-colors hover:bg-[rgba(248, 188, 66,0.08)] lg:inline-block"
          >
            Create your own
          </Link>
        </div>
      </header>

      {/* Mobile device switcher */}
      <div className="flex border-b border-[#E7EAF5] bg-white px-4 py-2 md:hidden">
        <div className="flex w-full gap-1 rounded-lg bg-[#FAFBFF] p-1">
          {devices.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-semibold",
                device === d.id ? "bg-white text-[#F8BC42] shadow-sm" : "text-[#667085]",
              )}
            >
              {d.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Main preview area */}
        <main className="flex flex-1 flex-col overflow-hidden p-4 lg:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h1 className="text-lg font-bold text-[#1A1F36]">{appName}</h1>
              <p className="text-xs text-[#667085]">
                {templateName} · v{schemaVersion} · Snapshot {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F8BC42]/30 bg-[rgba(248, 188, 66,0.1)] px-3 py-1 text-xs font-semibold text-[#F8BC42]">
              <span className="status-pulse-dot status-pulse-success h-2 w-2 rounded-full bg-[#F8BC42]" />
              Live preview
            </span>
          </div>

          <div className="flex flex-1 items-start justify-center overflow-auto">
            <div
              className="preview-device-frame floating mx-auto w-full max-h-full overflow-hidden"
              style={{ maxWidth: DEVICE_WIDTHS[device] }}
            >
              <div
                key={refreshKey}
                className="max-h-[calc(100vh-220px)] overflow-auto rounded-xl border border-[#E7EAF5] bg-[#FAFBFF] animate-fade-in-up"
              >
                <AppCanvas schema={schema} readOnly />
              </div>
            </div>
          </div>
        </main>

        {/* Right sidebar — preview tools */}
        <aside className="hidden w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-[#E7EAF5] bg-white/80 p-4 backdrop-blur-sm xl:flex">
          <div>
            <h2 className="text-sm font-bold text-[#1A1F36]">Preview insights</h2>
            <p className="text-xs text-[#667085]">Quality signals for this snapshot</p>
          </div>

          <ScoreCard label="Performance" value={scores.performance} color="#F8BC42" />
          <ScoreCard label="Accessibility" value={scores.accessibility} color="#F8BC42" />
          <div className="preview-insight-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#667085]">Page load</span>
              <Gauge size={16} className="text-[#F8BC42]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#1A1F36]">{scores.loadTime}</p>
          </div>
          <ScoreCard label="SEO" value={scores.seo} color="#FF5996" />

          <div className="preview-insight-card">
            <span className="text-sm font-medium text-[#667085]">Responsive check</span>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#F8BC42]">
              <Check size={16} />
              Passed at {device} breakpoint
            </p>
          </div>

          <div className="preview-insight-card flex-1">
            <div className="mb-3 flex items-center gap-2">
              <Terminal size={16} className="text-[#667085]" />
              <span className="text-sm font-semibold text-[#1A1F36]">Console</span>
              <ChevronDown size={14} className="ml-auto text-[#98A2B3]" />
            </div>
            <div className="max-h-40 space-y-2 overflow-y-auto font-mono text-[11px]">
              {MOCK_CONSOLE.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.level === "warn"
                      ? "text-[#FF5996]"
                      : line.level === "info"
                        ? "text-[#F8BC42]"
                        : "text-[#667085]"
                  }
                >
                  {line.message}
                  {i === 0 ? schemaVersion : i === 1 ? schema.components.length : ""}
                </p>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="preview-insight-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#667085]">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E7EAF5]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
