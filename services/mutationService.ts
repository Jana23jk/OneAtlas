import { nanoid } from "nanoid";
import type { AppSchema, SchemaMutation } from "@/types/app";

export function applyMutation(
  schema: AppSchema,
  mutation: SchemaMutation
): AppSchema {
  // Deep clone to avoid mutating the input
  const next = JSON.parse(JSON.stringify(schema)) as AppSchema;

  switch (mutation.type) {
    case "add_field": {
      const component = next.components.find(
        (c) => c.id === mutation.componentId
      );
      if (!component) {
        throw new Error(`Component ${mutation.componentId} not found`);
      }
      const newField = {
        id: nanoid(8),
        ...mutation.field,
      };
      component.fields.push(newField);
      return next;
    }

    case "remove_field": {
      const component = next.components.find(
        (c) => c.id === mutation.componentId
      );
      if (!component) {
        throw new Error(`Component ${mutation.componentId} not found`);
      }
      const fieldExists = component.fields.some(
        (f) => f.id === mutation.fieldId
      );
      if (!fieldExists) {
        throw new Error(
          `Field ${mutation.fieldId} not found in component`
        );
      }
      component.fields = component.fields.filter(
        (f) => f.id !== mutation.fieldId
      );
      return next;
    }

    case "rename_field": {
      const component = next.components.find(
        (c) => c.id === mutation.componentId
      );
      if (!component) {
        throw new Error(`Component ${mutation.componentId} not found`);
      }
      const field = component.fields.find((f) => f.id === mutation.fieldId);
      if (!field) {
        throw new Error(
          `Field ${mutation.fieldId} not found in component ${mutation.componentId}`
        );
      }
      field.name = mutation.newName;
      return next;
    }

    case "update_component_prop": {
      const component = next.components.find(
        (c) => c.id === mutation.componentId
      );
      if (!component) {
        throw new Error(`Component ${mutation.componentId} not found`);
      }
      if (!component.props) {
        component.props = {};
      }
      component.props[mutation.prop] = mutation.value;
      return next;
    }

    case "reorder_components": {
      const existingIds = new Set(next.components.map((c) => c.id));
      const orderedIds = new Set(mutation.orderedComponentIds);

      if (existingIds.size !== orderedIds.size) {
        throw new Error(
          "orderedComponentIds must contain exactly the existing component IDs"
        );
      }

      for (const id of mutation.orderedComponentIds) {
        if (!existingIds.has(id)) {
          throw new Error(
            "orderedComponentIds must contain exactly the existing component IDs"
          );
        }
      }

      const componentMap = new Map(
        next.components.map((c) => [c.id, c])
      );
      next.components = mutation.orderedComponentIds.map((id, index) => {
        const component = componentMap.get(id);
        if (!component) {
          throw new Error(
            "orderedComponentIds must contain exactly the existing component IDs"
          );
        }
        component.order = index;
        return component;
      });

      return next;
    }

    default:
      throw new Error(`Unknown mutation type: ${(mutation as any).type}`);
  }
}

export function describeMutation(mutation: SchemaMutation): string {
  switch (mutation.type) {
    case "add_field":
      return `Added field "${mutation.field.name}" (${mutation.field.type}) to component ${mutation.componentId}`;
    case "remove_field":
      return `Removed field ${mutation.fieldId} from component ${mutation.componentId}`;
    case "rename_field":
      return `Renamed field ${mutation.fieldId} to "${mutation.newName}" in component ${mutation.componentId}`;
    case "update_component_prop":
      return `Updated property "${mutation.prop}" to ${JSON.stringify(mutation.value)} on component ${mutation.componentId}`;
    case "reorder_components":
      return `Reordered components to [${mutation.orderedComponentIds.join(", ")}]`;
    default:
      return `Unknown mutation type`;
  }
}
