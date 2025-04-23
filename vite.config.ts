import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	server: {
		port: 6969
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA(),
		paraglide({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
