"use client";

import { AlertTriangle, ClipboardList, Package, Warehouse } from "lucide-react";
import { useAnimatedCounter } from "./useAnimatedCounter";

interface OverviewStat {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}

function AnimatedStatCard({ stat, delay }: { stat: OverviewStat; delay: number }) {
  const animated = useAnimatedCounter(stat.value);

  return (
    <div
      className="inventory-metric-card reveal"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-[#667085]">{stat.label}</span>
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: stat.bg, color: stat.accent }}
        >
          {stat.icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tabular-nums text-[#1A1F36]">
        {animated.toLocaleString()}
        {stat.suffix ? (
          <span className="ml-1 text-lg font-semibold text-[#667085]">{stat.suffix}</span>
        ) : null}
      </p>
      <p className="mt-2 text-xs font-medium text-[#635BFF]">↑ Updated live from runtime</p>
    </div>
  );
}

export function InventoryOverviewCards() {
  const stats: OverviewStat[] = [
    {
      label: "Total Products",
      value: 248,
      icon: <Package size={20} />,
      accent: "#635BFF",
      bg: "rgba(99, 91, 255,0.12)",
    },
    {
      label: "Stock Available",
      value: 12400,
      suffix: "units",
      icon: <Warehouse size={20} />,
      accent: "#635BFF",
      bg: "rgba(99, 91, 255,0.12)",
    },
    {
      label: "Low Stock Items",
      value: 14,
      icon: <AlertTriangle size={20} />,
      accent: "#F8BC42",
      bg: "rgba(248, 188, 66, 0.2)",
    },
    {
      label: "Pending Orders",
      value: 23,
      icon: <ClipboardList size={20} />,
      accent: "#FF5996",
      bg: "rgba(255, 89, 150,0.12)",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <AnimatedStatCard key={stat.label} stat={stat} delay={i * 0.08} />
      ))}
    </section>
  );
}
