import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom", // ブラウザ環境をシミュレート
        globals: true, // expectなどをグローバルに使えるようにする
        setupFiles: "./vitest.setup.ts",
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
});
