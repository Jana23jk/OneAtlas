import type { AppSchema, SchemaMutation } from "@/types/app";

// Standard API response envelope — used by EVERY endpoint
interface ApiResponse<T> {
  data: T | null;
  meta?: {
    version?: number;
    total?: number;
    page?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Generation endpoint
interface GenerateRequest {
  prompt: string;
}

interface GenerateResponse {
  appId: string;
  schema: AppSchema;
  templateUsed: string;
  generatedName: string;
  confidence: number;
}

// Edit endpoint
interface EditRequest {
  instruction: string;
}

interface EditResponse {
  schema: AppSchema;
  mutation: SchemaMutation;
  versionAfter: number;
  resultSummary: string;
}

// Preview endpoint
interface PreviewCreateResponse {
  previewUrl: string;
  token: string;
  expiresAt?: string;
}

export type {
  ApiResponse,
  GenerateRequest,
  GenerateResponse,
  EditRequest,
  EditResponse,
  PreviewCreateResponse,
};
