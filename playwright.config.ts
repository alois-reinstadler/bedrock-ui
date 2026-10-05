import { defineConfig } from '@playwright/test';

// Build first, then start a persistent managed preview. Tests never claim an
// arbitrary port or start a second server alongside the user's preview.
const hostedCI = process.env.GITHUB_ACTIONS === 'true';
const baseURL = process.env.DEV_LOCAL_URL ?? (hostedCI ? 'http://127.0.0.1:4173' : undefined);
if (!baseURL) {
	throw new Error('Set DEV_LOCAL_URL from dev-preview env before running production E2E.');
}

export default defineConfig({
	use: { baseURL, trace: 'retain-on-failure' },
	webServer: hostedCI
		? {
				command: 'pnpm preview --host 127.0.0.1 --port 4173 --strictPort',
				url: baseURL,
				reuseExistingServer: false,
				timeout: 120_000
			}
		: undefined,
	// Shared Chrome and animation sampling need deterministic ownership of browser time.
	workers: 1,
	testDir: './src',
	testMatch: '**/*.e2e.{ts,js}'
});
