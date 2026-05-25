import { NextResponse } from "next/server";
import type { EditRequest, EditResponse, ApiResponse } from "@/types/api";
import type { SchemaMutation } from "@/types/app";

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<EditResponse>>> {
  try {
    const body: EditRequest = await request.json();
    const { instruction } = body;

    if (!instruction || typeof instruction !== "string") {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "INVALID_REQUEST",
            message: "Instruction is required and must be a string",
          },
        },
        { status: 400 }
      );
    }

    // Simple instruction parsing for demo purposes
    // In a real implementation, this would use an AI service to understand natural language
    let mutation: SchemaMutation;
    let resultSummary = "";

    if (instruction.toLowerCase().includes("add field")) {
      mutation = {
        type: "add_field",
        componentId: "default-component",
        field: {
          name: "newField",
          type: "text",
          required: false,
        },
      };
      resultSummary = "Added new field to component";
    } else if (instruction.toLowerCase().includes("remove field")) {
      mutation = {
        type: "remove_field",
        componentId: "default-component",
        fieldId: "field_to_remove",
      };
      resultSummary = "Removed field from component";
    } else if (instruction.toLowerCase().includes("rename")) {
      mutation = {
        type: "rename_field",
        componentId: "default-component",
        fieldId: "field_to_rename",
        newName: "newFieldName",
      };
      resultSummary = "Renamed field";
    } else {
      mutation = {
        type: "update_component_prop",
        componentId: "default-component",
        prop: "title",
        value: "Updated Title",
      };
      resultSummary = "Updated component property";
    }

    const response: EditResponse = {
      schema: {
        version: 1,
        components: [],
        dataModel: {
          entities: [],
          primaryEntity: "",
        },
      },
      mutation,
      versionAfter: 2,
      resultSummary,
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to edit schema",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}
