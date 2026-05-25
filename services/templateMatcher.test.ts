import { matchTemplate, suggestReformulation } from "./templateMatcher";

describe("templateMatcher", () => {
  describe("matchTemplate", () => {
    it("should match CRM Workspace for sales pipeline prompt", () => {
      const result = matchTemplate("I need a sales pipeline for my team");

      expect(result).not.toBeNull();
      expect(result?.template.name).toBe("CRM Workspace");
      expect(result?.template.slug).toBe("crm-workspace");
      expect(result?.confidence).toBeGreaterThanOrEqual(0.15);
      expect(result?.matchedKeywords).toContain("sales");
      expect(result?.matchedKeywords).toContain("pipeline");
    });

    it("should match Inventory System for warehouse stock prompt", () => {
      const result = matchTemplate("track my warehouse stock and suppliers");

      expect(result).not.toBeNull();
      expect(result?.template.name).toBe("Inventory System");
      expect(result?.template.slug).toBe("inventory-system");
      expect(result?.confidence).toBeGreaterThanOrEqual(0.15);
      expect(result?.matchedKeywords).toContain("stock");
      expect(result?.matchedKeywords).toContain("warehouse");
    });

    it("should return null for gibberish prompt", () => {
      const result = matchTemplate("gibberish xyzabc");

      expect(result).toBeNull();
    });

    it("should return null for empty prompt", () => {
      const result = matchTemplate("");

      expect(result).toBeNull();
    });

    it("should return null for whitespace-only prompt", () => {
      const result = matchTemplate("   ");

      expect(result).toBeNull();
    });

    it("should match HR Dashboard for employee management prompt", () => {
      const result = matchTemplate("I need to manage my employees and track leave");

      expect(result).not.toBeNull();
      expect(result?.template.name).toBe("HR Dashboard");
      expect(result?.template.slug).toBe("hr-dashboard");
      expect(result?.confidence).toBeGreaterThanOrEqual(0.15);
    });

    it("should match Analytics Workspace for metrics prompt", () => {
      const result = matchTemplate("Show me revenue analytics and kpi dashboard");

      expect(result).not.toBeNull();
      expect(result?.template.name).toBe("Analytics Workspace");
      expect(result?.template.slug).toBe("analytics-workspace");
      expect(result?.confidence).toBeGreaterThanOrEqual(0.15);
    });

    it("should match Admin Panel for user management prompt", () => {
      const result = matchTemplate("I need to manage users and permissions");

      expect(result).not.toBeNull();
      expect(result?.template.name).toBe("Admin Panel");
      expect(result?.template.slug).toBe("admin-panel");
      expect(result?.confidence).toBeGreaterThanOrEqual(0.15);
    });

    it("should not return matches below confidence threshold", () => {
      const result = matchTemplate("hello world");

      expect(result).toBeNull();
    });
  });

  describe("suggestReformulation", () => {
    it("should return helpful suggestion message", () => {
      const result = suggestReformulation("some prompt");

      expect(result).toContain("Try describing the type of data");
      expect(result).toContain("CRM");
      expect(result).toContain("analytics dashboard");
    });
  });
});
