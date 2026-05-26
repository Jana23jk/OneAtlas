"use client";

import { useEffect, useState } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { BuilderTopBar } from "@/components/builder/BuilderTopBar";
import { ComponentTree } from "@/components/builder/ComponentTree";
import { AppCanvas } from "@/components/builder/AppCanvas";
import { PropertiesPanel } from "@/components/builder/PropertiesPanel";
import { ConversationalInput } from "@/components/builder/ConversationalInput";
import type { AppSchema, MutationLogEntry } from "@/types/app";

interface BuilderClientProps {
  appId: string;
  appName: string;
  schema: AppSchema;
  initialHistory: MutationLogEntry[];
}

export function BuilderClient({
  appId,
  appName,
  schema,
  initialHistory,
}: BuilderClientProps) {
  const initialize = useBuilderStore((state) => state.initialize);
  const leftCollapsed = useBuilderStore((state) => state.leftCollapsed);
  const rightCollapsed = useBuilderStore((state) => state.rightCollapsed);
  const currentSchema = useBuilderStore((state) => state.schema);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initialize(appId, appName, schema, initialHistory);
    setMounted(true);
  }, [appId, appName, schema, initialHistory, initialize]);

  if (!mounted || !currentSchema) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0A2540] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-[#635BFF] border-white/20" />
          <span className="text-sm text-white/60">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0A2540] text-white">
      {/* Top Bar */}
      <BuilderTopBar />

      {/* Main Workspace Layout */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Sidebar: Components Tree */}
        <div
          className={`hidden border-r border-white/[0.08] bg-[#0A2540] transition-all duration-300 md:block ${
            leftCollapsed ? "w-0 overflow-hidden opacity-0" : "w-[260px]"
          }`}
        >
          <ComponentTree />
        </div>

        {/* Center: Canvas Workspace */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#0a1b2e]/30 relative">
          <AppCanvas />
          <ConversationalInput />
        </div>

        {/* Right Panel: Properties & History */}
        <div
          className={`hidden border-l border-white/[0.08] bg-[#0A2540] transition-all duration-300 md:block ${
            rightCollapsed ? "w-0 overflow-hidden opacity-0" : "w-[320px]"
          }`}
        >
          <PropertiesPanel />
        </div>
      </div>

      {/* Connection Status Bar */}
      <div className="flex h-7 items-center justify-between border-t border-white/[0.05] bg-[#071d33] px-4 text-[11px] text-[#8892A4] shrink-0 z-30">
        <div className="flex items-center gap-4">
          <span>Schema v{currentSchema.version}</span>
          <span className="h-3 w-[1px] bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D4B1]" />
            <span>Connected</span>
          </div>
        </div>
        <div>
          <span>Press Enter to submit edit prompt</span>
        </div>
      </div>
    </div>
  );
}
