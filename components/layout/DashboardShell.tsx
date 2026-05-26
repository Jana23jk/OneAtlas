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
    <div className="flex h-screen overflow-hidden bg-[#f7f8ff]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        appId={appId}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {topBar}
        <div className="flex-1 overflow-hidden bg-gradient-to-b from-[#f7f8ff] to-white">
          {children}
        </div>
        {statusBar}
      </div>
    </div>
  );
}
