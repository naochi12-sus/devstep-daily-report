import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "my-e2e-test/**", // ← ここにPlaywrightのフォルダ名を追加！
        ],
        coverage: {
            provider: "v8", // または 'istanbul'
            reporter: ["text", "json", "html"],
        },
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
