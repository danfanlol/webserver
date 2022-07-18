import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

// https://vitejs.dev/config/
export default ({mode}) => defineConfig({
    plugins: [vue({
        template: {
            compilerOptions: {
                isCustomElement: tagName => tagName.includes("-"),
            },
        },
    })],

    build: {
        sourcemap: mode === "development",

        rollupOptions: {
            input: {
                findtutors: path.resolve("./findtutors/src/index.ts"),
                tutor: path.resolve("./tutor/src/index.ts"),
            },
            output: {
                entryFileNames: "[name]/app.js",
            },
        },

        // https://vitejs.dev/guide/build.html#library-mode
        lib: {
            entry: path.resolve("./index.ts"),
            formats: ["es"],
            // fileName: () => "index.js",
            // fileName: (format: string) => `index.${format}.js`,
        },
    },
});