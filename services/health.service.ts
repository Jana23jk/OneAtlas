import type { ApiResponse } from "@/types/api";

interface HealthData {
  status: "ok" | "degraded" | "error";
  service: string;
  timestamp: string;
}

export function getHealthStatus(): ApiResponse<HealthData> {
  return {
    data: {
      status: "ok",
      service: "oneatlas",
      timestamp: new Date().toISOString(),
    },
  };
}
