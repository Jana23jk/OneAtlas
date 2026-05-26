"use client";

import { useEffect, useState } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { DashboardShell } from "@/components/layout/DashboardShell";
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
      <div className="flex h-screen w-screen items-center justify-center bg-surface-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
          <span className="text-sm text-text-secondary">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell
      appId={appId}
      topBar={<BuilderTopBar />}
      statusBar={
        <div className="flex h-9 shrink-0 items-center justify-between border-t border-[#E7EAF5] bg-white px-5 text-xs text-[#667085]">
          <span>
            Schema <strong className="text-[#0A2540]">v{currentSchema.version}</strong>
          </span>
          <span className="font-medium text-[#00D4B1]">● Connected</span>
        </div>
      }
    >
      <div className="flex h-full overflow-hidden">
        <div
          className={`hidden transition-all duration-300 md:block ${
            leftCollapsed ? "w-0 overflow-hidden opacity-0" : "w-[260px]"
          }`}
        >
          <ComponentTree />
        </div>

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <AppCanvas />
          <ConversationalInput />
        </div>

        <div
          className={`hidden transition-all duration-300 md:block ${
            rightCollapsed ? "w-0 overflow-hidden opacity-0" : "w-[340px]"
          }`}
        >
          <PropertiesPanel />
        </div>
      </div>
    </DashboardShell>
  );
}
