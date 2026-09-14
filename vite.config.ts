import { fileURLToPath } from 'node:url';
import { mdsvex } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

const runtimeEnvironment = process.env.NODE_ENV ?? 'development';

export default defineConfig({
	cacheDir: `node_modules/.vite-${runtimeEnvironment}`,
	server: {
		watch: {
			ignored: [
				'**/build/**',
				'**/docs/bedrock/site-expansion/screenshots/**',
				'**/docs/bedrock/site-expansion/verification/**'
			]
		}
	},
	// Component examples are route-level lazy chunks. Pre-bundle their bare
	// dependencies once so opening a new example in dev does not trigger Vite's
	// optimizer restart (which can briefly serve a stale route or a 500).
	optimizeDeps: {
		exclude: ['sveltekit-superforms'],
		include: [
			'@internationalized/date',
			'@lucide/svelte/icons/**',
			'@tanstack/svelte-table',
			'bits-ui',
			'formsnap',
			'layerchart',
			'marked',
			'mode-watcher',
			'paneforge',
			'pdfjs-dist',
			'shiki',
			'svelte-sonner',
			'tailwind-variants',
			'tailwind-merge'
		]
	},
	plugins: [
		{
			name: 'bedrock-superforms-kit3',
			enforce: 'pre',
			// Superforms 2 imports two legacy stores. Keep its adapter narrow instead
			// of overriding SvelteKit modules for application code or other packages.
			transform(code, id) {
				if (!id.replaceAll('\\', '/').endsWith('/sveltekit-superforms/dist/client/superForm.js'))
					return;
				return {
					code: code.replace(
						"from '$app/stores'",
						`from ${JSON.stringify(fileURLToPath(new URL('./src/lib/site/superforms-stores.ts', import.meta.url)))}`
					),
					map: null
				};
			}
		},
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: { async: true }
			},
			adapter: adapter(),
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
			extensions: ['.svelte', '.svx', '.md'],
			experimental: { remoteFunctions: true, forkPreloads: true }
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
