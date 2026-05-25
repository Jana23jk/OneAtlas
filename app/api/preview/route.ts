import { NextResponse } from "next/server";
import type { PreviewCreateResponse, ApiResponse } from "@/types/api";
import { generateToken } from "@/lib/tokens";

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<PreviewCreateResponse>>> {
  try {
    const body = await request.json();
    const { schema } = body;

    if (!schema) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "INVALID_REQUEST",
            message: "Schema is required",
          },
        },
        { status: 400 }
      );
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const response: PreviewCreateResponse = {
      previewUrl: `/preview/${token}`,
      token,
      expiresAt: expiresAt.toISOString(),
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to create preview",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}
