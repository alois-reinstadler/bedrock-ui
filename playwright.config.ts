import { defineConfig } from '@playwright/test';

const port = 4174;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
	use: { baseURL },
	webServer: {
		command: `pnpm run build && pnpm exec vite preview --host 127.0.0.1 --port ${port} --strictPort`,
		url: baseURL,
		reuseExistingServer: false
	},
	testMatch: '**/*.e2e.{ts,js}'
});
