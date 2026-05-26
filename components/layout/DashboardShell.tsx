"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  appId?: string;
  topBar?: React.ReactNode;
  statusBar?: React.ReactNode;
}

export function DashboardShell({
  children,
  appId,
  topBar,
  statusBar,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FF]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        appId={appId}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {topBar}
        <div className="builder-workspace relative flex-1 overflow-hidden">
          <div className="relative z-10 h-full">{children}</div>
        </div>
        {statusBar}
      </div>
    </div>
  );
}
