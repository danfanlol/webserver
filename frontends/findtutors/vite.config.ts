import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue({
        template: {
            compilerOptions: {
                isCustomElement: tagName => tagName.includes("-"),
            },
        },
    })],

    // https://vitejs.dev/guide/build.html#library-mode
    build: {
        lib: {
            entry: path.resolve("./src/index.ts"),
            name: "FindTutors",
            formats: ["es"],
            // Change path alongside ./routes/findtutors
            fileName: () => "index.js",
            // fileName: (format: string) => `index.${format}.js`,
        },
    },
})
