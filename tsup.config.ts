import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,

  tsconfig: "tsconfig.lib.json",

  esbuildOptions(options) {
    options.alias = {
      "@": "./src",
    };
  },

  external: ["react", "react-dom", "@tanstack/react-form", "zod"],
});
