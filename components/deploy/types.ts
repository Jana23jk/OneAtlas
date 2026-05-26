export type DeploymentStatus = "success" | "running" | "pending" | "failed";
export type DeployEnvironment = "production" | "staging" | "development";

export interface DeploymentRecord {
  id: string;
  timestamp: string;
  environment: DeployEnvironment;
  status: DeploymentStatus;
  user: string;
  commitMessage: string;
  buildDuration: string;
}

/** Status colors mapping */
export const STATUS_COLORS: Record<DeploymentStatus, string> = {
  success: "#00D4B1",
  running: "#635BFF",
  pending: "#F8BC42",
  failed: "#FF5996",
};
