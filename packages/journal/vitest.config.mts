import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Node に無い IndexedDB をメモリ上の実装で補う
    setupFiles: ["fake-indexeddb/auto"],
  },
});
