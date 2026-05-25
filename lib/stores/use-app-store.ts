"use client";

import { create } from "zustand";
import type { App } from "@/types/app";

interface AppStoreState {
  selectedAppId: string | null;
  apps: App[];
  setSelectedAppId: (id: string | null) => void;
  setApps: (apps: App[]) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  selectedAppId: null,
  apps: [],
  setSelectedAppId: (id) => set({ selectedAppId: id }),
  setApps: (apps) => set({ apps }),
}));
