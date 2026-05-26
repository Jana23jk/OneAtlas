"use client";

import { useMemo, useState } from "react";
import type { AppSchema, SchemaComponent, SchemaField } from "@/types/app";
import { Badge } from "@/components/ui/badge";
import { InventoryOverviewCards } from "./InventoryOverviewCards";
import { StockStatusBadge, getStockStatus } from "./StockStatusBadge";
import {
  ArrowDownUp,
  Download,
  Filter,
  Hash,
  Layers,
  Package,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RuntimeAppCanvasProps {
  schema: AppSchema;
  isInventory?: boolean;
}

const INVENTORY_PRODUCTS = [
  {
    name: "Wireless Mouse Pro",
    sku: "SKU-1042",
    category: "Electronics",
    quantity: 420,
    reorderPoint: 100,
    supplier: "TechSupply Co",
  },
  {
    name: "Ergonomic Keyboard",
    sku: "SKU-2088",
    category: "Electronics",
    quantity: 28,
    reorderPoint: 50,
    supplier: "KeyWorks Ltd",
  },
  {
    name: "USB-C Hub 7-in-1",
    sku: "SKU-3310",
    category: "Accessories",
    quantity: 0,
    reorderPoint: 25,
    supplier: "ConnectPro",
  },
  {
    name: "Monitor Stand XL",
    sku: "SKU-4491",
    category: "Furniture",
    quantity: 156,
    reorderPoint: 40,
    supplier: "OfficeFit",
  },
  {
    name: "Laptop Sleeve 15\"",
    sku: "SKU-5520",
    category: "Accessories",
    quantity: 12,
    reorderPoint: 30,
    supplier: "CarryAll Inc",
  },
];

const STOCK_MOVEMENTS = [
  { product: "Wireless Mouse Pro", type: "In", quantity: 120, date: "2026-05-24", notes: "Restock PO-8821" },
  { product: "Ergonomic Keyboard", type: "Out", quantity: 15, date: "2026-05-23", notes: "Order #4421" },
  { product: "USB-C Hub 7-in-1", type: "Adjustment", quantity: -3, date: "2026-05-22", notes: "Cycle count" },
  { product: "Monitor Stand XL", type: "In", quantity: 40, date: "2026-05-21", notes: "Supplier delivery" },
];

function fieldIcon(field: SchemaField) {
  const key = field.name.toLowerCase();
  if (key.includes("sku")) return <Hash size={14} className="text-[#635BFF]" />;
  if (key.includes("quantity") || key.includes("stock")) return <Layers size={14} className="text-[#635BFF]" />;
  if (key.includes("supplier")) return <Truck size={14} className="text-[#667085]" />;
  if (key.includes("name") || key.includes("product")) return <Package size={14} className="text-[#635BFF]" />;
  return null;
}

function getInventoryCellValue(
  comp: SchemaComponent,
  field: SchemaField,
  rowIndex: number,
): React.ReactNode {
  const key = field.name.toLowerCase();
  const product = INVENTORY_PRODUCTS[rowIndex % INVENTORY_PRODUCTS.length];
  const movement = STOCK_MOVEMENTS[rowIndex % STOCK_MOVEMENTS.length];

  if (comp.id === "inv-products") {
    if (key.includes("name")) return product.name;
    if (key.includes("sku")) return product.sku;
    if (key.includes("category")) return product.category;
    if (key.includes("quantity")) return product.quantity.toLocaleString();
    if (key.includes("reorder")) return product.reorderPoint.toString();
    if (key.includes("supplier")) return product.supplier;
    if (key.includes("status") || key === "stock") {
      return (
        <StockStatusBadge status={getStockStatus(product.quantity, product.reorderPoint)} />
      );
    }
  }

  if (comp.id === "inv-stock-movements") {
    if (key.includes("product")) return movement.product;
    if (key.includes("type")) {
      const colors: Record<string, string> = {
        In: "#00D4B1",
        Out: "#FF5996",
        Adjustment: "#F8BC42",
      };
      const c = colors[movement.type] ?? "#667085";
      return (
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: `${c}20`, color: c }}
        >
          {movement.type}
        </span>
      );
    }
    if (key.includes("quantity")) return movement.quantity.toString();
    if (key.includes("date")) return movement.date;
    if (key.includes("notes")) return <span className="text-[#667085]">{movement.notes}</span>;
  }

  return getGenericDummy(field.name, field.type, rowIndex);
}

function getGenericDummy(name: string, type: string, index: number) {
  const key = name.toLowerCase();
  if (type === "number") return index === 0 ? "1,200" : index === 1 ? "4,500" : "850";
  if (type === "date") return index === 0 ? "2026-05-01" : index === 1 ? "2026-05-15" : "2026-05-26";
  if (key.includes("status")) return index === 0 ? "Active" : index === 1 ? "Pending" : "Completed";
  return index === 0 ? "Acme Corp" : index === 1 ? "Beta Inc" : "Gamma LLC";
}

function TableToolbar({ title, isInventory }: { title: string; isInventory: boolean }) {
  const [localSearch, setLocalSearch] = useState("");

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[#E7EAF5] pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-2xl font-bold text-[#1A1F36]">{title}</h3>
        <p className="mt-1 text-sm text-[#667085]">
          {isInventory ? "Manage and monitor inventory records" : "Data table view"}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search…"
            className="h-9 w-36 rounded-lg border border-[#E7EAF5] bg-[#FAFBFF] pl-8 pr-2 text-xs text-[#1A1F36] outline-none focus:border-[#635BFF]"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E7EAF5] bg-white px-3 text-xs font-semibold text-[#667085] transition-colors hover:bg-[#FAFBFF] hover:text-[#1A1F36]"
        >
          <Filter size={14} />
          Filter
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E7EAF5] bg-white px-3 text-xs font-semibold text-[#667085] transition-colors hover:bg-[#FAFBFF] hover:text-[#1A1F36]"
        >
          <ArrowDownUp size={14} />
          Sort
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E7EAF5] bg-white px-3 text-xs font-semibold text-[#667085] transition-colors hover:bg-[#FAFBFF] hover:text-[#1A1F36]"
        >
          <Download size={14} />
          Export
        </button>
        {isInventory ? (
          <button type="button" className="btn-deploy-primary !h-9 !px-3 !text-xs">
            <Plus size={14} />
            Add Product
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function RuntimeAppCanvas({ schema, isInventory = false }: RuntimeAppCanvasProps) {
  const sorted = useMemo(
    () => [...schema.components].sort((a, b) => a.order - b.order),
    [schema.components],
  );

  const renderTable = (comp: SchemaComponent) => {
    const rows = isInventory ? INVENTORY_PRODUCTS.length : 3;
    const showStatusCol =
      isInventory &&
      comp.id === "inv-products" &&
      !comp.fields.some((f) => f.name.toLowerCase().includes("status"));

    return (
      <div className="inventory-table-panel">
        <TableToolbar title={comp.name} isInventory={isInventory} />
        <div className="runtime-table-wrap">
          <table className="runtime-table">
            <thead>
              <tr>
                {comp.fields.map((f) => (
                  <th key={f.id}>
                    <span className="inline-flex items-center gap-2">
                      {isInventory ? fieldIcon(f) : null}
                      {f.name}
                    </span>
                  </th>
                ))}
                {showStatusCol ? (
                  <th>
                    <span className="inline-flex items-center gap-2">Status</span>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <tr key={i}>
                  {comp.fields.map((f) => (
                    <td key={f.id}>
                      <span className="font-medium text-[#1A1F36]">
                        {isInventory
                          ? getInventoryCellValue(comp, f, i)
                          : getGenericDummy(f.name, f.type, i)}
                      </span>
                    </td>
                  ))}
                  {showStatusCol ? (
                    <td>
                      <StockStatusBadge
                        status={getStockStatus(
                          INVENTORY_PRODUCTS[i].quantity,
                          INVENTORY_PRODUCTS[i].reorderPoint,
                        )}
                      />
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMetric = (comp: SchemaComponent) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {comp.fields.map((f, i) => {
        const values = isInventory
          ? ["248", "14", "3"]
          : [`${(i + 1) * 425}`, `${(i + 1) * 120}`, "Active"];
        const accents = ["#635BFF", "#FF5996", "#FF5996"];
        return (
          <div
            key={f.id}
            className="inventory-metric-card !p-5"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <span className="block truncate text-xs font-semibold uppercase tracking-wider text-[#667085]">
              {f.name}
            </span>
            <span className="mt-2 block text-2xl font-bold text-[#1A1F36]">{values[i] ?? "—"}</span>
            <span className="mt-1 block text-xs font-medium" style={{ color: accents[i] ?? "#635BFF" }}>
              {isInventory ? "Live from warehouse sync" : "↑ 12% vs last month"}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderChart = (comp: SchemaComponent) => (
    <div className="rounded-2xl border border-[#E7EAF5] bg-[#FAFBFF] p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-[#1A1F36]">{comp.name}</h3>
        <p className="text-sm text-[#667085]">
          {isInventory ? "Stock distribution by category" : "Chart visualization"}
        </p>
      </div>
      <div className="flex h-48 items-end justify-between gap-2 border-b border-[#E7EAF5] pb-3">
        {isInventory
          ? [
              { label: "Electronics", h: 85 },
              { label: "Accessories", h: 55 },
              { label: "Furniture", h: 40 },
              { label: "Office", h: 30 },
            ].map((bar) => (
              <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  style={{ height: `${bar.h}%` }}
                  className="w-full rounded-t bg-gradient-to-t from-[#635BFF] to-[#544cf4] opacity-90 transition-all hover:opacity-100"
                />
                <span className="text-[10px] font-medium text-[#667085]">{bar.label}</span>
              </div>
            ))
          : [40, 75, 55, 90, 60, 85].map((h, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  style={{ height: `${h}%` }}
                  className="w-full rounded-t bg-gradient-to-t from-[#635BFF] to-[#544cf4]"
                />
                <span className="font-mono text-[10px] text-[#98A2B3]">Q{i + 1}</span>
              </div>
            ))}
      </div>
    </div>
  );

  const renderList = (comp: SchemaComponent) => (
    <ul className="divide-y divide-[#E7EAF5] overflow-hidden rounded-2xl border border-[#E7EAF5] bg-white">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-center gap-3 p-4 transition-colors hover:bg-[#F4F5FF]">
          <div className="h-2 w-2 shrink-0 rounded-full bg-[#635BFF]" />
          <div className="flex flex-1 flex-wrap justify-between gap-3 text-sm">
            {comp.fields.slice(0, 3).map((f) => (
              <span key={f.id} className="text-[#1A1F36]">
                <span className="font-medium text-[#667085] capitalize">{f.name}:</span>{" "}
                {getGenericDummy(f.name, f.type, i)}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );

  const renderForm = (comp: SchemaComponent) => (
    <div className="grid gap-4 rounded-2xl border border-[#E7EAF5] bg-[#FAFBFF] p-6 sm:grid-cols-2">
      {comp.fields.map((f) => (
        <div key={f.id} className="flex flex-col gap-2">
          <label className="text-sm font-semibold capitalize text-[#1A1F36]">{f.name}</label>
          <input disabled type="text" className="input-premium w-full text-sm" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative mx-auto max-w-7xl space-y-10 px-6 py-8 pb-16 animate-fade-in-up">
      {isInventory ? (
        <>
          <section className="reveal space-y-2">
            <h2 className="text-2xl font-bold text-[#1A1F36]">Inventory overview</h2>
            <p className="text-sm text-[#667085]">
              Real-time warehouse metrics across products, stock levels, and fulfillment.
            </p>
          </section>
          <InventoryOverviewCards />
        </>
      ) : null}

      {sorted.length === 0 && (
        <p className="text-center text-sm text-[#667085]">No components in schema yet.</p>
      )}

      {sorted.map((comp, idx) => (
        <section
          key={comp.id}
          className={cn(
            "reveal",
            comp.type === "table" ? "" : "inventory-table-panel",
          )}
          style={{ animationDelay: `${0.1 + idx * 0.06}s` }}
        >
          {comp.type !== "table" ? (
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1A1F36]">{comp.name}</h3>
                <p className="mt-1 font-mono text-xs text-[#98A2B3]">{comp.id}</p>
              </div>
              <Badge variant="outline" className="shrink-0 uppercase">
                {comp.type}
              </Badge>
            </div>
          ) : null}

          {comp.type === "table" && renderTable(comp)}
          {comp.type === "metric" && renderMetric(comp)}
          {comp.type === "chart" && renderChart(comp)}
          {comp.type === "form" && renderForm(comp)}
          {comp.type === "list" && renderList(comp)}
        </section>
      ))}
    </div>
  );
}
