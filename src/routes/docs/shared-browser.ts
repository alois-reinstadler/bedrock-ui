import { chromium, test as base } from '@playwright/test';

// Use the container's shared Chrome. Playwright owns only the isolated test
// contexts it creates; closing this connection does not stop the shared browser.
export const test = base.extend({
	browser: [
		async ({ browserName }, use) => {
			if (browserName !== 'chromium') throw new Error('These checks require the shared Chrome.');
			const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
			try {
				await use(browser);
			} finally {
				await browser.close();
			}
		},
		{ scope: 'worker' }
	]
});

export { expect } from '@playwright/test';
