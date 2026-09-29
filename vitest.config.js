import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    extensions: [".js", ".mjs", ".json"],
  },
  test: {
    globals: true,
    environment: "node",
    include: ["__tests__/**/*.test.js"],
    testTimeout: 10000,
  },
});
