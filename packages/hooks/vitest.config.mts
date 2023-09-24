import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    restoreMocks: true,
    unstubEnvs: true,
    setupFiles: ["./setup-tests.ts"],
    coverage: {
      include: ["./index.ts"],
      provider: "v8",
      enabled: true,
      all: true,
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
});
