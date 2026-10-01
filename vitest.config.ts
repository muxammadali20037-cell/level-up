import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const alias = { "server-only": path.resolve(__dirname, "tests/helpers/empty-module.ts") };

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: { alias },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts", "content/**/*.test.ts", "tests/unit/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          globalSetup: ["tests/helpers/db-global-setup.ts"],
          setupFiles: ["tests/helpers/integration-setup.ts"],
          fileParallelism: false,
          testTimeout: 30_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
});
