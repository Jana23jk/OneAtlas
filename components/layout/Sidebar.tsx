"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Play,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/templates", label: "Templates", icon: Layers },
  { href: "/runtime", label: "Runtime", icon: Play },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/security", label: "Security", icon: Settings },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  appId?: string;
}

export function Sidebar({ collapsed, onToggle, appId }: SidebarProps) {
  const pathname = usePathname();

  const items = appId
    ? [
        { href: `/builder/${appId}`, label: "Builder", icon: LayoutDashboard },
        { href: `/deploy/${appId}`, label: "Deploy", icon: Rocket },
        { href: `/run/${appId}`, label: "Run", icon: Play },
        ...navItems,
      ]
    : navItems;

  return (
    <aside
      className={cn(
        "sidebar-dark flex h-full flex-col border-r border-white/10 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      <div className="flex h-nav items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/" className="text-lg font-bold text-white">
            One<span className="text-brand-primary-light">Atlas</span>
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-nav-item",
                active && "sidebar-nav-item-active",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
