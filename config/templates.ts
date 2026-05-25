import type { AppSchema, AppTemplate, SchemaComponent, SchemaField } from "@/types/app";

function field(
  id: string,
  name: string,
  type: SchemaField["type"],
  options?: { required?: boolean; options?: string[] },
): SchemaField {
  return {
    id,
    name,
    type,
    required: options?.required,
    options: options?.options,
  };
}

function component(
  id: string,
  name: string,
  type: SchemaComponent["type"],
  order: number,
  fields: SchemaField[],
  props?: Record<string, unknown>,
): SchemaComponent {
  return { id, name, type, order, fields, props };
}

function schema(
  components: SchemaComponent[],
  dataModel: AppSchema["dataModel"],
): AppSchema {
  return {
    version: 1,
    components,
    dataModel,
  };
}

export const templates: AppTemplate[] = [
  {
    id: "tpl-crm-workspace",
    name: "CRM Workspace",
    slug: "crm-workspace",
    category: "CRM",
    complexity: "MODERATE",
    tags: ["crm", "contacts", "deals", "pipeline", "sales", "customers", "leads"],
    description:
      "A full CRM with contacts, deal pipeline, and activity tracking.",
    version: 1,
    schemaDefaults: schema(
      [
        component("crm-contacts", "Contacts", "table", 0, [
          field("contact-name", "name", "text", { required: true }),
          field("contact-email", "email", "text", { required: true }),
          field("contact-phone", "phone", "text"),
          field("contact-status", "status", "select", {
            options: ["Lead", "Active", "Churned"],
          }),
          field("contact-company", "company", "text"),
        ]),
        component("crm-deals", "Deals", "table", 1, [
          field("deal-title", "title", "text", { required: true }),
          field("deal-value", "value", "number"),
          field("deal-stage", "stage", "select", {
            options: ["Prospect", "Proposal", "Closed Won", "Closed Lost"],
          }),
          field("deal-contact-id", "contactId", "relation"),
          field("deal-close-date", "closeDate", "date"),
        ]),
        component("crm-pipeline-summary", "Pipeline Summary", "metric", 2, [
          field("pipeline-total-deals", "totalDeals", "number"),
          field("pipeline-open-value", "openValue", "number"),
          field("pipeline-closed-won", "closedWon", "number"),
        ]),
        component("crm-deal-stages", "Deal Stages", "chart", 3, [
          field("deal-stages-stage", "stage", "text"),
          field("deal-stages-count", "count", "number"),
        ]),
      ],
      {
        entities: ["Contact", "Deal", "Activity"],
        primaryEntity: "Contact",
      },
    ),
  },
  {
    id: "tpl-hr-dashboard",
    name: "HR Dashboard",
    slug: "hr-dashboard",
    category: "HR",
    complexity: "MODERATE",
    tags: ["hr", "employees", "leave", "payroll", "onboarding", "headcount", "people"],
    description:
      "HR management with employee records, leave tracking, and headcount analytics.",
    version: 1,
    schemaDefaults: schema(
      [
        component("hr-employees", "Employees", "table", 0, [
          field("employee-name", "name", "text", { required: true }),
          field("employee-role", "role", "text"),
          field("employee-department", "department", "text"),
          field("employee-start-date", "startDate", "date"),
          field("employee-status", "status", "select", {
            options: ["Active", "On Leave", "Terminated"],
          }),
        ]),
        component("hr-leave-requests", "Leave Requests", "table", 1, [
          field("leave-employee-id", "employeeId", "relation"),
          field("leave-type", "type", "select", {
            options: ["Annual", "Sick", "Unpaid"],
          }),
          field("leave-start-date", "startDate", "date"),
          field("leave-end-date", "endDate", "date"),
          field("leave-status", "status", "select", {
            options: ["Pending", "Approved", "Rejected"],
          }),
        ]),
        component("hr-headcount", "Headcount", "metric", 2, [
          field("headcount-total", "total", "number"),
          field("headcount-active", "active", "number"),
          field("headcount-on-leave", "onLeave", "number"),
        ]),
        component("hr-department-breakdown", "Department Breakdown", "chart", 3, [
          field("dept-breakdown-department", "department", "text"),
          field("dept-breakdown-count", "count", "number"),
        ]),
      ],
      {
        entities: ["Employee", "LeaveRequest", "Department"],
        primaryEntity: "Employee",
      },
    ),
  },
  {
    id: "tpl-admin-panel",
    name: "Admin Panel",
    slug: "admin-panel",
    category: "Admin",
    complexity: "SIMPLE",
    tags: ["admin", "users", "permissions", "roles", "management", "settings", "control"],
    description:
      "User and permission management panel with role-based access control.",
    version: 1,
    schemaDefaults: schema(
      [
        component("admin-users", "Users", "table", 0, [
          field("user-name", "name", "text", { required: true }),
          field("user-email", "email", "text", { required: true }),
          field("user-role", "role", "select", {
            options: ["Admin", "Editor", "Viewer"],
          }),
          field("user-status", "status", "select", {
            options: ["Active", "Suspended"],
          }),
          field("user-last-login", "lastLogin", "date"),
        ]),
        component("admin-roles", "Roles", "table", 1, [
          field("role-name", "name", "text", { required: true }),
          field("role-permissions", "permissions", "text"),
        ]),
        component("admin-user-stats", "User Stats", "metric", 2, [
          field("stats-total-users", "totalUsers", "number"),
          field("stats-active-today", "activeToday", "number"),
          field("stats-suspended", "suspended", "number"),
        ]),
      ],
      {
        entities: ["User", "Role", "Permission"],
        primaryEntity: "User",
      },
    ),
  },
  {
    id: "tpl-inventory-system",
    name: "Inventory System",
    slug: "inventory-system",
    category: "Operations",
    complexity: "MODERATE",
    tags: [
      "inventory",
      "stock",
      "warehouse",
      "products",
      "sku",
      "supply",
      "orders",
      "logistics",
    ],
    description:
      "Product inventory with stock tracking, supplier management, and low-stock alerts.",
    version: 1,
    schemaDefaults: schema(
      [
        component("inv-products", "Products", "table", 0, [
          field("product-name", "name", "text", { required: true }),
          field("product-sku", "sku", "text", { required: true }),
          field("product-category", "category", "text"),
          field("product-quantity", "quantity", "number"),
          field("product-reorder-point", "reorderPoint", "number"),
          field("product-supplier", "supplier", "text"),
        ]),
        component("inv-stock-movements", "Stock Movements", "table", 1, [
          field("movement-product-id", "productId", "relation"),
          field("movement-type", "type", "select", {
            options: ["In", "Out", "Adjustment"],
          }),
          field("movement-quantity", "quantity", "number"),
          field("movement-date", "date", "date"),
          field("movement-notes", "notes", "text"),
        ]),
        component("inv-inventory-health", "Inventory Health", "metric", 2, [
          field("health-total-products", "totalProducts", "number"),
          field("health-low-stock", "lowStock", "number"),
          field("health-out-of-stock", "outOfStock", "number"),
        ]),
        component("inv-stock-by-category", "Stock by Category", "chart", 3, [
          field("stock-category", "category", "text"),
          field("stock-quantity", "quantity", "number"),
        ]),
      ],
      {
        entities: ["Product", "StockMovement", "Supplier"],
        primaryEntity: "Product",
      },
    ),
  },
  {
    id: "tpl-analytics-workspace",
    name: "Analytics Workspace",
    slug: "analytics-workspace",
    category: "Analytics",
    complexity: "ADVANCED",
    tags: [
      "analytics",
      "metrics",
      "revenue",
      "kpi",
      "dashboard",
      "reports",
      "charts",
      "data",
      "insights",
    ],
    description:
      "Executive analytics workspace with KPI tracking, revenue charts, and funnel analysis.",
    version: 1,
    schemaDefaults: schema(
      [
        component("analytics-kpi-overview", "KPI Overview", "metric", 0, [
          field("kpi-revenue", "revenue", "number"),
          field("kpi-growth", "growth", "number"),
          field("kpi-churn", "churn", "number"),
          field("kpi-active-users", "activeUsers", "number"),
        ]),
        component("analytics-revenue-over-time", "Revenue Over Time", "chart", 1, [
          field("revenue-date", "date", "date"),
          field("revenue-amount", "revenue", "number"),
          field("revenue-target", "target", "number"),
        ]),
        component("analytics-funnel", "Funnel Analysis", "chart", 2, [
          field("funnel-stage", "stage", "text"),
          field("funnel-users", "users", "number"),
          field("funnel-conversion-rate", "conversionRate", "number"),
        ]),
        component("analytics-top-events", "Top Events", "table", 3, [
          field("event-name", "event", "text", { required: true }),
          field("event-count", "count", "number"),
          field("event-trend", "trend", "number"),
        ]),
      ],
      {
        entities: ["Event", "Session", "Conversion"],
        primaryEntity: "Event",
      },
    ),
  },
];
