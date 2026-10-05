import { expect, test } from './shared-browser';

test.setTimeout(60_000);

test('On this page follows manual scrolling to the final example and back', async ({ page }) => {
	await page.setViewportSize({ width: 1920, height: 1000 });
	await page.goto('/docs/components/scroll-area');
	await expect(page.getByText('Review a busy workspace', { exact: true })).toBeVisible({
		timeout: 30_000
	});
	const outline = page.getByRole('navigation', { name: 'Scroll Area sections' });
	const active = outline.locator('[aria-current="location"]');
	await expect(active).toHaveText('Common variants');
	await page.evaluate(() =>
		window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
	);
	await expect(active).toHaveText('Examples');
	// The regression: the last section cannot reach the 72px activation line.
	expect(
		await page.locator('#examples').evaluate((el) => el.getBoundingClientRect().top)
	).toBeGreaterThan(73);
	await page.locator('#behavior').evaluate((el) =>
		window.scrollTo({
			top: window.scrollY + el.getBoundingClientRect().top - 72,
			behavior: 'instant'
		})
	);
	await expect(active).toHaveText('Behavior');
	await outline.getByRole('link', { name: 'Examples', exact: true }).click();
	await expect(active).toHaveText('Examples');
	await expect
		.poll(() => page.evaluate(() => document.documentElement.scrollHeight - scrollY - innerHeight))
		.toBeLessThanOrEqual(1);
	await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
	await expect(active).toHaveText('Common variants');
});
