import { describe, it, expect, beforeEach } from "vitest";
import { createTestHarness } from "@frontmltd/frontmjs/test-runtime";

import "../src/main.js";

describe("Template — app start (MAIN intent)", () => {
  let harness;

  beforeEach(async () => {
    harness = await createTestHarness({
      botId: "templateApp",
      userId: "test-user-1",
      userEmail: "test@vessel.com",
      domain: "test-domain",
    });
  });

  it("should respond without errors on main intent", async () => {
    const result = await harness.sendMessage({ intentId: "main" });

    expect(result.error).toBe(false);
    expect(result.responses.length).toBeGreaterThan(0);
  });

  it("should return a string response", async () => {
    const result = await harness.sendMessage({ intentId: "main" });

    expect(result.responseType).toBe("string");

    // getStringMessages() returns message OBJECTS, not bare strings —
    // [{ content: "Hello World! Welcome to frontM", options: { ... } }] — so a plain toContain()
    // against a string can never match. Assert on the content of one of them.
    expect(result.getStringMessages()).toContainEqual(
      expect.objectContaining({ content: "Hello World! Welcome to frontM" })
    );
  });
});
