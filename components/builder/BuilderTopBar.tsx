"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBuilderStore } from "@/store/builderStore";
import { Button } from "@/components/ui/button";
import { Play, Share2, Rocket, ArrowLeft, Check } from "lucide-react";

export function BuilderTopBar() {
  const appId = useBuilderStore((state) => state.appId);
  const appName = useBuilderStore((state) => state.appName);
  const schema = useBuilderStore((state) => state.schema);
  const updateAppName = useBuilderStore((state) => state.updateAppName);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState(appName || "");

  useEffect(() => {
    setLocalName(appName || "");
  }, [appName]);

  const handleRename = async () => {
    setEditing(false);
    if (!localName.trim() || localName === appName) return;

    updateAppName(localName);

    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: localName }),
      });
      if (!res.ok) {
        console.error("Failed to persist app name rename");
      }
    } catch (err) {
      console.error("Rename API failed:", err);
    }
  };

  const handlePreview = async () => {
    try {
      const res = await fetch(`/api/apps/${appId}/preview`, {
        method: "POST",
      });
      const data = await res.json();
      if (data?.data?.previewUrl) {
        await navigator.clipboard.writeText(data.data.previewUrl);
        setToastMsg("Preview link copied!");
        setTimeout(() => setToastMsg(null), 2000);
      } else {
        console.error("Preview URL not found");
      }
    } catch (err) {
      console.error("Preview generation failed:", err);
    }
  };

  return (
    <header className="flex h-[68px] items-center justify-between border-b border-white/[0.08] bg-[#0A2540] px-6 shrink-0 relative z-30">
      {/* Left: Back Link & Editable Name */}
      <div className="flex items-center gap-4">
        <Link
          href="/generate"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white transition-all hover:bg-white/5"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2">
          {editing ? (
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="rounded border border-[#635BFF] bg-white/5 px-2 py-0.5 text-base font-bold text-white outline-none focus:ring-1 focus:ring-[#635BFF]"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => setEditing(true)}
              className="cursor-pointer rounded border border-transparent px-2 py-0.5 text-base font-bold text-white hover:border-white/10 hover:bg-white/[0.02]"
              title="Rename Application"
            >
              {appName || "Loading..."}
            </h1>
          )}
        </div>
      </div>

      {/* Center: Version badge */}
      <div>
        {schema && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="font-semibold text-white">Version</span>
            <span className="rounded bg-[#635BFF]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#8a84ff]">
              v{schema.version}
            </span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handlePreview}
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 border-white/10 bg-transparent text-white/80 hover:bg-white/5 hover:text-white"
        >
          <Play size={14} /> Preview
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-white/60 hover:text-white hover:bg-white/5"
        >
          <Share2 size={14} /> Share
        </Button>
        <Button size="sm" className="h-9 gap-1.5 bg-[#635BFF] text-white hover:bg-[#7a73ff]">
          <Rocket size={14} /> Deploy
        </Button>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute left-1/2 bottom-[-48px] -translate-x-1/2 flex items-center gap-1.5 rounded-lg border border-[#00D4B1]/20 bg-[#071d33] px-4 py-2 text-xs font-medium text-[#00D4B1] shadow-xl animate-fade-in-up">
          <Check size={14} /> {toastMsg}
        </div>
      )}
    </header>
  );
}
