import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		port: 6969,
		host: '0.0.0.0',
		strictPort: true,
		hmr: {
			clientPort: 6969
		},
		watch: {
			usePolling: true
		},
		proxy: {},
		fs: {
			strict: false,
			allow: ['.']
		},
		origin: 'http://localhost:6969',
		allowedHosts: ['localhost', 'pan-samochodzik.test', 'pan-samochodzik.local']
	},
	plugins: [sveltekit()]
};

export default config;
