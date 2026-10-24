import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    // Node に無い IndexedDB をメモリ上の実装で補う
    setupFiles: ["fake-indexeddb/auto"],
  },
});
