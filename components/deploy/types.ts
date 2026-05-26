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

/** Status colors — primary (#7A73FF) and accent (#FFB17A) only */
export const STATUS_COLORS: Record<DeploymentStatus, string> = {
  success: "#7A73FF",
  running: "#7A73FF",
  pending: "#FFB17A",
  failed: "#1A1F36",
};
