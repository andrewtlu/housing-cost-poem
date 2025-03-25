import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            pages: "build",
            assets: "build",
            fallback: undefined,
            precompress: false,
            strict: true
        }),
        paths: {
            assets: process.env.NODE_ENV == "production" ? "https://yourusername.github.io/housing-cost-poem" : "",
            base: process.env.NODE_ENV == "production" ? "/housing-cost-poem" : ""
        }
    }
};

export default config;
