import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit(), tailwindcss()],
    base: process.env.GITHUB_PAGES === "true" ? "/housing-cost-poem/" : "/"
});
