import { create } from "zustand";
import type { AppSchema, MutationLogEntry } from "@/types/app";

interface BuilderState {
  appId: string | null;
  appName: string | null;
  schema: AppSchema | null;
  selectedComponentId: string | null;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  history: MutationLogEntry[];

  initialize: (appId: string, appName: string, schema: AppSchema, history: MutationLogEntry[]) => void;
  setSchema: (schema: AppSchema) => void;
  updateAppName: (newName: string) => void;
  setSelectedComponentId: (id: string | null) => void;
  toggleLeft: () => void;
  toggleRight: () => void;
  setHistory: (history: MutationLogEntry[]) => void;
  addHistoryEntry: (entry: MutationLogEntry) => void;
  updateHistoryEntry: (id: string, update: Partial<MutationLogEntry>) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  appId: null,
  appName: null,
  schema: null,
  selectedComponentId: null,
  leftCollapsed: false,
  rightCollapsed: false,
  history: [],

  initialize: (appId, appName, schema, history) =>
    set({
      appId,
      appName,
      schema,
      history,
      selectedComponentId: schema.components[0]?.id || null,
    }),

  setSchema: (schema) => set({ schema }),

  updateAppName: (appName) => set({ appName }),

  setSelectedComponentId: (id) => set({ selectedComponentId: id }),

  toggleLeft: () => set((state) => ({ leftCollapsed: !state.leftCollapsed })),

  toggleRight: () => set((state) => ({ rightCollapsed: !state.rightCollapsed })),

  setHistory: (history) => set({ history }),

  addHistoryEntry: (entry) =>
    set((state) => ({
      history: [...state.history, entry],
    })),

  updateHistoryEntry: (id, update) =>
    set((state) => ({
      history: state.history.map((h) => (h.id === id ? { ...h, ...update } : h)),
    })),
}));
