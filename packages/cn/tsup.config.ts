import { defineConfig } from "tsup";

export default defineConfig((opts) => ({
  entryPoints: ["index.ts"],
  format: ["cjs", "esm"],
  clean: !opts.watch,
  outDir: "dist",
  target: "es2017",
}));
