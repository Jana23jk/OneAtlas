import type {
  SchemaMutation,
  AddFieldMutation,
  RemoveFieldMutation,
  RenameFieldMutation,
  ReorderComponentsMutation,
} from "@/types/app";

// Valid field types that can be created via natural language
const VALID_FIELD_TYPES = ["text", "number", "date", "boolean", "select"] as const;
type ValidFieldType = (typeof VALID_FIELD_TYPES)[number];

function isValidFieldType(value: string): value is ValidFieldType {
  return (VALID_FIELD_TYPES as readonly string[]).includes(value);
}

// Normalise a string into a machine-friendly field name: lowercase, underscored
function toFieldName(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

// Generate a "Did you mean...?" suggestion string for unrecognised instructions
export function suggestInstruction(instruction: string): string {
  const lower = instruction.toLowerCase();

  if (lower.includes("add") || lower.includes("insert") || lower.includes("new")) {
    return (
      'Did you mean: "add a [fieldName] field" or ' +
      '"add a [text|number|date|boolean|select] field called [name]"?'
    );
  }

  if (lower.includes("remov") || lower.includes("delet") || lower.includes("drop")) {
    return 'Did you mean: "remove the [fieldName] field"?';
  }

  if (lower.includes("renam") || lower.includes("chang") || lower.includes("updat")) {
    return 'Did you mean: "rename [oldName] to [newName]"?';
  }

  if (lower.includes("move") || lower.includes("reorder") || lower.includes("top")) {
    return 'Did you mean: "move [componentName] to the top"?';
  }

  return (
    'Try one of: "add a [name] field", "remove the [name] field", ' +
    '"rename [old] to [new]", "move [component] to the top", or ' +
    '"add a [text|number|date|boolean|select] field called [name]".'
  );
}

/**
 * Parse a natural-language instruction into a typed SchemaMutation.
 *
 * Because the live schema is not available here, mutations reference the
 * **first** component by sentinel ID "__first__" for field-level operations.
 * The caller (applyMutation) will substitute the real component ID before use,
 * or throw a clear error if the target cannot be resolved.
 *
 * Returns null if no known pattern matches the instruction.
 */
export function parseInstruction(instruction: string): SchemaMutation | null {
  const raw = instruction.trim();
  const lower = raw.toLowerCase();

  // ─── Pattern 1 ─────────────────────────────────────────────────────────────
  // "add a/an [fieldName] field" | "add [fieldName] field" | "add [fieldName]"
  // Generic add — defaults to type 'text'. Must NOT match "add a TYPE field called NAME"
  // (that is captured by Pattern 5 below, which is checked first).
  // ───────────────────────────────────────────────────────────────────────────

  // ─── Pattern 5 ─────────────────────────────────────────────────────────────
  // "add a [fieldType] field called [name]"
  // e.g. "add a number field called price", "add a date field called dueDate"
  // Check this BEFORE Pattern 1 because it is more specific.
  // ───────────────────────────────────────────────────────────────────────────
  const addTypedFieldRegex =
    /\badd\s+(?:a\s+|an\s+)?(\w+)\s+field\s+called\s+([a-zA-Z0-9_\s]+)/i;
  const addTypedMatch = raw.match(addTypedFieldRegex);
  if (addTypedMatch) {
    const rawType = addTypedMatch[1].toLowerCase();
    const rawName = addTypedMatch[2];
    if (isValidFieldType(rawType)) {
      const mutation: AddFieldMutation = {
        type: "add_field",
        componentId: "__first__",
        field: {
          name: toFieldName(rawName),
          type: rawType,
          required: false,
        },
      };
      return mutation;
    }
    // If the type word is unrecognised, fall through to other patterns
  }

  // Pattern 1 (generic text field)
  const addGenericFieldRegex =
    /\badd\s+(?:a\s+|an\s+)?([a-zA-Z0-9_\s]+?)\s+field\b/i;
  const addGenericMatch = raw.match(addGenericFieldRegex);
  if (addGenericMatch) {
    const rawName = addGenericMatch[1];
    // Skip if the captured name is itself a valid type keyword (handled by P5 above)
    if (!isValidFieldType(rawName.toLowerCase().trim())) {
      const mutation: AddFieldMutation = {
        type: "add_field",
        componentId: "__first__",
        field: {
          name: toFieldName(rawName),
          type: "text",
          required: false,
        },
      };
      return mutation;
    }
  }

  // Short form: "add [fieldName]" with no trailing "field" keyword
  const addShortRegex = /^\s*add\s+([a-zA-Z0-9_]+)\s*$/i;
  const addShortMatch = raw.match(addShortRegex);
  if (addShortMatch) {
    const mutation: AddFieldMutation = {
      type: "add_field",
      componentId: "__first__",
      field: {
        name: toFieldName(addShortMatch[1]),
        type: "text",
        required: false,
      },
    };
    return mutation;
  }

  // ─── Pattern 2 ─────────────────────────────────────────────────────────────
  // "remove the [fieldName] field" | "remove [fieldName]" | "remove [fieldName] field"
  // fieldId is set to a sentinel name; applyMutation resolves it by name.
  // ───────────────────────────────────────────────────────────────────────────
  const removeFieldRegex =
    /\b(?:remove|delete|drop)\s+(?:the\s+)?([a-zA-Z0-9_\s]+?)\s*(?:field)?\s*$/i;
  const removeMatch = raw.match(removeFieldRegex);
  if (removeMatch) {
    const mutation: RemoveFieldMutation = {
      type: "remove_field",
      componentId: "__first__",
      // Sentinel: the route resolves field name → field id against the live schema
      fieldId: `__name:${toFieldName(removeMatch[1])}__`,
    };
    return mutation;
  }

  // ─── Pattern 3 ─────────────────────────────────────────────────────────────
  // "rename [oldName] to [newName]"
  // ───────────────────────────────────────────────────────────────────────────
  const renameFieldRegex =
    /\brename\s+(?:the\s+)?([a-zA-Z0-9_]+)\s+(?:field\s+)?to\s+([a-zA-Z0-9_]+)/i;
  const renameMatch = raw.match(renameFieldRegex);
  if (renameMatch) {
    const mutation: RenameFieldMutation = {
      type: "rename_field",
      componentId: "__first__",
      // Sentinel: resolved by name in the route before calling applyMutation
      fieldId: `__name:${toFieldName(renameMatch[1])}__`,
      newName: toFieldName(renameMatch[2]),
    };
    return mutation;
  }

  // ─── Pattern 4 ─────────────────────────────────────────────────────────────
  // "move [componentName] to the top"
  // ───────────────────────────────────────────────────────────────────────────
  const moveToTopRegex =
    /\bmove\s+(?:the\s+)?([a-zA-Z0-9_\s]+?)\s+(?:component\s+)?to\s+the\s+top\b/i;
  const moveToTopMatch = raw.match(moveToTopRegex);
  if (moveToTopMatch) {
    const componentName = moveToTopMatch[1].trim();
    // Sentinel list: the route resolves the component name to an ordered ID list
    const mutation: ReorderComponentsMutation = {
      type: "reorder_components",
      // Sentinel prefix so the route knows to resolve by name and move to index 0
      orderedComponentIds: [`__move_to_top:${componentName}__`],
    };
    return mutation;
  }

  // No pattern matched
  return null;
}
