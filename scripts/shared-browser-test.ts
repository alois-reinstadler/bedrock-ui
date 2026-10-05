import { test as base, expect, chromium } from '@playwright/test';

/** E2E fixtures attach shared Chrome and create a fresh context per test. */
const sharedTest = base.extend({
	browser: [
		// Playwright reads fixture dependencies from the required destructuring pattern.
		// eslint-disable-next-line no-empty-pattern
		async ({}, use) => {
			const browser = await chromium.connectOverCDP(
				process.env.SHARED_BROWSER_CDP_URL ?? 'http://127.0.0.1:9222',
				{ noDefaults: true, timeout: 15_000 }
			);
			try {
				await use(browser);
			} finally {
				// A connected Browser.close disconnects this client, preserving Chrome
				// and foreign default-context tabs. Test contexts are owned by fixtures.
				await browser.close();
			}
		},
		{ scope: 'worker' }
	]
});

export { expect };
export type { Page, Locator, BrowserContext } from '@playwright/test';

// Hosted CI owns its browser; the shared development container always attaches.
export const test = process.env.GITHUB_ACTIONS === 'true' ? base : sharedTest;
