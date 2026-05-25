import { NextResponse } from "next/server";
import type { GenerateRequest, GenerateResponse, ApiResponse } from "@/types/api";
import { templates } from "@/config/templates";

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<GenerateResponse>>> {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "INVALID_REQUEST",
            message: "Prompt is required and must be a string",
          },
        },
        { status: 400 }
      );
    }

    // Simple template matching based on keywords in the prompt
    // In a real implementation, this would use an AI service
    const matchedTemplate = templates.find((template) => {
      const keywords = template.tags.concat(
        template.name.toLowerCase().split(" "),
        template.description.toLowerCase().split(" ")
      );
      return keywords.some((keyword) =>
        prompt.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    const selectedTemplate = matchedTemplate || templates[0]; // Default to first template if no match

    const response: GenerateResponse = {
      appId: `app_${Date.now()}`,
      schema: selectedTemplate.schemaDefaults,
      templateUsed: selectedTemplate.id,
      generatedName: `${selectedTemplate.name} App`,
      confidence: matchedTemplate ? 0.85 : 0.5,
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to generate app",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}
