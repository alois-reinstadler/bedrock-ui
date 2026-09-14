import { defineConfig } from '@playwright/test';

// Build first, then start a persistent managed preview. Tests never claim an
// arbitrary port or start a second server alongside the user's preview.
const baseURL = process.env.DEV_LOCAL_URL;
if (!baseURL) {
	throw new Error('Set DEV_LOCAL_URL from dev-preview env before running production E2E.');
}

export default defineConfig({
	use: { baseURL },
	workers: 2,
	testMatch: '**/*.e2e.{ts,js}'
});
