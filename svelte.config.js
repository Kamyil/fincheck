import { mdsvex } from 'mdsvex';
import adapter from '@eslym/sveltekit-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter({
			out: './build',
			bundler: 'bun',
			serveStatic: true,
			sourceMap: true
		}),

		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
