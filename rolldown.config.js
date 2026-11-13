import { defineConfig } from "rolldown";

export default defineConfig({
  input: {
    index: "src/index.ts"
  },
  output: {
    dir: "dist",
    format: "esm",
    cleanDir: true,
    minify: true,
    sourcemap: true
  },
  platform: "node"
});
