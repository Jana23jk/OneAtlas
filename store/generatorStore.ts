import { create } from "zustand";
import type { GenerateResponse, ApiResponse } from "@/types/api";

interface GeneratorState {
  prompt: string;
  status: "idle" | "loading" | "success" | "error";
  loadingStep: string;
  result: GenerateResponse | null;
  error: string | null;
  errorCode: string | null;
  suggestion: string | null;

  setPrompt: (prompt: string) => void;
  updateAppName: (newName: string) => void;
  renameAppOnServer: (newName: string) => Promise<void>;
  generateApp: () => Promise<void>;
  reset: () => void;
}

const steps = ["Matching template...", "Building schema...", "Finalizing app..."];

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  prompt: "",
  status: "idle",
  loadingStep: "",
  result: null,
  error: null,
  errorCode: null,
  suggestion: null,

  setPrompt: (prompt) => set({ prompt }),

  updateAppName: (newName) => {
    const result = get().result;
    if (result) {
      set({
        result: {
          ...result,
          generatedName: newName,
        },
      });
    }
  },

  renameAppOnServer: async (newName) => {
    const result = get().result;
    if (!result) return;
    try {
      const res = await fetch(`/api/apps/${result.appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) {
        console.error("Failed to rename app in database");
      }
    } catch (err) {
      console.error("Error renaming app:", err);
    }
  },

  generateApp: async () => {
    const { prompt } = get();
    if (prompt.length < 5) return;

    set({
      status: "loading",
      loadingStep: steps[0],
      error: null,
      errorCode: null,
      suggestion: null,
      result: null,
    });

    // Start step progression timer
    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        set({ loadingStep: steps[stepIdx] });
      }
    }, 1200);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const responseJson: ApiResponse<GenerateResponse> = await res.json();

      clearInterval(interval);

      if (!res.ok || responseJson.error) {
        const err = responseJson.error || { code: "UNKNOWN_ERROR", message: "Failed to generate app" };
        set({
          status: "error",
          error: err.message,
          errorCode: err.code,
          suggestion: err.code === "NO_TEMPLATE_MATCH" ? err.message : null,
        });
      } else if (responseJson.data) {
        set({
          status: "success",
          result: responseJson.data,
        });
      } else {
        set({
          status: "error",
          error: "No data returned from generator",
          errorCode: "NO_DATA",
        });
      }
    } catch (err) {
      clearInterval(interval);
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      set({
        status: "error",
        error: message,
        errorCode: "FETCH_ERROR",
      });
    }
  },

  reset: () =>
    set({
      status: "idle",
      loadingStep: "",
      result: null,
      error: null,
      errorCode: null,
      suggestion: null,
    }),
}));
