import { applyMutation, describeMutation } from "./mutationService";
import type { AppSchema, SchemaMutation } from "@/types/app";

// Mock nanoid
jest.mock("nanoid", () => ({
  nanoid: () => "mocked-id-123",
}));

describe("mutationService", () => {
  const mockSchema: AppSchema = {
    version: 1,
    components: [
      {
        id: "comp-1",
        name: "Contacts",
        type: "table",
        order: 0,
        fields: [
          {
            id: "field-1",
            name: "name",
            type: "text",
            required: true,
          },
          {
            id: "field-2",
            name: "email",
            type: "text",
            required: true,
          },
        ],
      },
      {
        id: "comp-2",
        name: "Deals",
        type: "table",
        order: 1,
        fields: [
          {
            id: "field-3",
            name: "title",
            type: "text",
            required: true,
          },
        ],
      },
    ],
    dataModel: {
      entities: ["Contact", "Deal"],
      primaryEntity: "Contact",
    },
  };

  describe("applyMutation", () => {
    describe("add_field", () => {
      it("should successfully add a field to a component", () => {
        const mutation: SchemaMutation = {
          type: "add_field",
          componentId: "comp-1",
          field: {
            name: "phone",
            type: "text",
            required: false,
          },
        };

        const result = applyMutation(mockSchema, mutation);

        expect(result.version).toBe(1);
        expect(result.components).toHaveLength(2);
        expect(result.components[0].fields).toHaveLength(3);
        expect(result.components[0].fields[2].name).toBe("phone");
        expect(result.components[0].fields[2].type).toBe("text");
        expect(result.components[0].fields[2].id).toBeDefined();
        expect(result.components[0].fields[2].id).toBe("mocked-id-123");

        // Verify original schema is not mutated
        expect(mockSchema.components[0].fields).toHaveLength(2);
      });

      it("should throw error when componentId is not found", () => {
        const mutation: SchemaMutation = {
          type: "add_field",
          componentId: "non-existent",
          field: {
            name: "phone",
            type: "text",
          },
        };

        expect(() => applyMutation(mockSchema, mutation)).toThrow(
          "Component non-existent not found"
        );
      });
    });

    describe("remove_field", () => {
      it("should successfully remove a field from a component", () => {
        const mutation: SchemaMutation = {
          type: "remove_field",
          componentId: "comp-1",
          fieldId: "field-1",
        };

        const result = applyMutation(mockSchema, mutation);

        expect(result.components[0].fields).toHaveLength(1);
        expect(result.components[0].fields[0].id).toBe("field-2");

        // Verify original schema is not mutated
        expect(mockSchema.components[0].fields).toHaveLength(2);
      });

      it("should throw error when fieldId is not found", () => {
        const mutation: SchemaMutation = {
          type: "remove_field",
          componentId: "comp-1",
          fieldId: "non-existent",
        };

        expect(() => applyMutation(mockSchema, mutation)).toThrow(
          "Field non-existent not found in component"
        );
      });
    });

    describe("rename_field", () => {
      it("should successfully rename a field", () => {
        const mutation: SchemaMutation = {
          type: "rename_field",
          componentId: "comp-1",
          fieldId: "field-1",
          newName: "fullName",
        };

        const result = applyMutation(mockSchema, mutation);

        expect(result.components[0].fields[0].name).toBe("fullName");
        expect(result.components[0].fields[0].id).toBe("field-1");

        // Verify original schema is not mutated
        expect(mockSchema.components[0].fields[0].name).toBe("name");
      });

      it("should throw error when component is not found", () => {
        const mutation: SchemaMutation = {
          type: "rename_field",
          componentId: "non-existent",
          fieldId: "field-1",
          newName: "fullName",
        };

        expect(() => applyMutation(mockSchema, mutation)).toThrow(
          "Component non-existent not found"
        );
      });

      it("should throw error when field is not found", () => {
        const mutation: SchemaMutation = {
          type: "rename_field",
          componentId: "comp-1",
          fieldId: "non-existent",
          newName: "fullName",
        };

        expect(() => applyMutation(mockSchema, mutation)).toThrow(
          "Field non-existent not found in component comp-1"
        );
      });
    });

    describe("update_component_prop", () => {
      it("should successfully update a component property", () => {
        const mutation: SchemaMutation = {
          type: "update_component_prop",
          componentId: "comp-1",
          prop: "title",
          value: "New Title",
        };

        const result = applyMutation(mockSchema, mutation);

        expect(result.components[0].props).toBeDefined();
        expect(result.components[0].props?.title).toBe("New Title");

        // Verify original schema is not mutated
        expect(mockSchema.components[0].props).toBeUndefined();
      });

      it("should throw error when component is not found", () => {
        const mutation: SchemaMutation = {
          type: "update_component_prop",
          componentId: "non-existent",
          prop: "title",
          value: "New Title",
        };

        expect(() => applyMutation(mockSchema, mutation)).toThrow(
          "Component non-existent not found"
        );
      });
    });

    describe("reorder_components", () => {
      it("should successfully reorder components", () => {
        const mutation: SchemaMutation = {
          type: "reorder_components",
          orderedComponentIds: ["comp-2", "comp-1"],
        };

        const result = applyMutation(mockSchema, mutation);

        expect(result.components[0].id).toBe("comp-2");
        expect(result.components[0].order).toBe(0);
        expect(result.components[1].id).toBe("comp-1");
        expect(result.components[1].order).toBe(1);

        // Verify original schema is not mutated
        expect(mockSchema.components[0].id).toBe("comp-1");
        expect(mockSchema.components[0].order).toBe(0);
      });

      it("should throw error when orderedComponentIds has mismatched IDs", () => {
        const mutation: SchemaMutation = {
          type: "reorder_components",
          orderedComponentIds: ["comp-1", "comp-3"],
        };

        expect(() => applyMutation(mockSchema, mutation)).toThrow(
          "orderedComponentIds must contain exactly the existing component IDs"
        );
      });

      it("should throw error when orderedComponentIds has different count", () => {
        const mutation: SchemaMutation = {
          type: "reorder_components",
          orderedComponentIds: ["comp-1"],
        };

        expect(() => applyMutation(mockSchema, mutation)).toThrow(
          "orderedComponentIds must contain exactly the existing component IDs"
        );
      });
    });
  });

  describe("describeMutation", () => {
    it("should describe add_field mutation", () => {
      const mutation: SchemaMutation = {
        type: "add_field",
        componentId: "comp-1",
        field: {
          name: "phone",
          type: "text",
        },
      };

      const description = describeMutation(mutation);

      expect(description).toContain("Added field");
      expect(description).toContain("phone");
      expect(description).toContain("text");
      expect(description).toContain("comp-1");
    });

    it("should describe remove_field mutation", () => {
      const mutation: SchemaMutation = {
        type: "remove_field",
        componentId: "comp-1",
        fieldId: "field-1",
      };

      const description = describeMutation(mutation);

      expect(description).toContain("Removed field");
      expect(description).toContain("field-1");
      expect(description).toContain("comp-1");
    });

    it("should describe rename_field mutation", () => {
      const mutation: SchemaMutation = {
        type: "rename_field",
        componentId: "comp-1",
        fieldId: "field-1",
        newName: "fullName",
      };

      const description = describeMutation(mutation);

      expect(description).toContain("Renamed field");
      expect(description).toContain("field-1");
      expect(description).toContain("fullName");
      expect(description).toContain("comp-1");
    });

    it("should describe update_component_prop mutation", () => {
      const mutation: SchemaMutation = {
        type: "update_component_prop",
        componentId: "comp-1",
        prop: "title",
        value: "New Title",
      };

      const description = describeMutation(mutation);

      expect(description).toContain("Updated property");
      expect(description).toContain("title");
      expect(description).toContain("New Title");
      expect(description).toContain("comp-1");
    });

    it("should describe reorder_components mutation", () => {
      const mutation: SchemaMutation = {
        type: "reorder_components",
        orderedComponentIds: ["comp-2", "comp-1"],
      };

      const description = describeMutation(mutation);

      expect(description).toContain("Reordered components");
      expect(description).toContain("comp-2");
      expect(description).toContain("comp-1");
    });
  });
});
