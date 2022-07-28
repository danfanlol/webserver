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

    /* resolve: {
        alias: {
            "@shared": path.resolve("./_shared/"),
            "@lib": path.resolve("../lib/"),
            "@": path.resolve("./"),
        },
    }, */

    build: {
        sourcemap: mode === "development",

        rollupOptions: {
            input: {
                findtutors: path.resolve("./findtutors/index.ts"),
                user: path.resolve("./user/index.ts"),
                admin: path.resolve("./admin/index.ts"),
            },
            output: {
                entryFileNames: "[name]/index.js",
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