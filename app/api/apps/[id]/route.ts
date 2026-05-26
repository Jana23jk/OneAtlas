import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ id: string; name: string }>>> {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "Name is required",
          },
        },
        { status: 400 }
      );
    }

    const app = await prisma.app.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({
      data: {
        id: app.id,
        name: app.name,
      },
    });
  } catch (error) {
    console.error(`[PATCH /api/apps/${id}] Error:`, error);
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update app name",
        },
      },
      { status: 500 }
    );
  }
}
