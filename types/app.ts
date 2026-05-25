// The shape of a component inside a schema
interface SchemaField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "boolean" | "select" | "relation";
  required?: boolean;
  options?: string[]; // for 'select' type
}

interface SchemaComponent {
  id: string;
  name: string;
  type: "table" | "chart" | "form" | "card" | "list" | "metric";
  fields: SchemaField[];
  order: number;
  props?: Record<string, unknown>;
}

interface AppSchema {
  version: number;
  components: SchemaComponent[];
  dataModel: {
    entities: string[];
    primaryEntity: string;
  };
}

interface AppTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  complexity: "SIMPLE" | "MODERATE" | "ADVANCED";
  tags: string[];
  schemaDefaults: AppSchema;
  parentTemplateId?: string;
  version: number;
}

interface App {
  id: string;
  name: string;
  slug: string;
  templateId: string;
  currentSchemaVersion: number;
  createdAt: string;
}

interface MutationLogEntry {
  id: string;
  instruction: string;
  mutationType: string;
  resultSummary: string;
  success: boolean;
  schemaVersionAfter: number;
  createdAt: string;
}

interface PreviewSnapshot {
  id: string;
  appId: string;
  token: string;
  schema: AppSchema;
  expiresAt?: string;
  createdAt: string;
}

// Mutation payload types
type MutationType =
  | "add_field"
  | "remove_field"
  | "rename_field"
  | "update_component_prop"
  | "reorder_components";

interface AddFieldMutation {
  type: "add_field";
  componentId: string;
  field: Omit<SchemaField, "id">;
}

interface RemoveFieldMutation {
  type: "remove_field";
  componentId: string;
  fieldId: string;
}

interface RenameFieldMutation {
  type: "rename_field";
  componentId: string;
  fieldId: string;
  newName: string;
}

interface UpdateComponentPropMutation {
  type: "update_component_prop";
  componentId: string;
  prop: string;
  value: unknown;
}

interface ReorderComponentsMutation {
  type: "reorder_components";
  orderedComponentIds: string[];
}

type SchemaMutation =
  | AddFieldMutation
  | RemoveFieldMutation
  | RenameFieldMutation
  | UpdateComponentPropMutation
  | ReorderComponentsMutation;

export type {
  SchemaField,
  SchemaComponent,
  AppSchema,
  AppTemplate,
  App,
  MutationLogEntry,
  PreviewSnapshot,
  MutationType,
  SchemaMutation,
  AddFieldMutation,
  RemoveFieldMutation,
  RenameFieldMutation,
  UpdateComponentPropMutation,
  ReorderComponentsMutation,
};
