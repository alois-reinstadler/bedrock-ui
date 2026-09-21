import { expect, test } from '@playwright/test';

test('sidebar keeps one shared highlight through navigation, scrolling and history', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const navigation = page.locator('[data-docs-navigation]');
	const highlight = navigation.locator('[data-slot="docs-active-highlight"]');
	await expect(highlight).toHaveCount(1);
	const original = await highlight.elementHandle();
	const travel = await navigation.evaluate(async (root) => {
		const indicator = root.querySelector<HTMLElement>('[data-slot="docs-active-highlight"]')!;
		const start = indicator.getBoundingClientRect().top;
		(root.querySelector('a[href="/docs/components/alert"]') as HTMLAnchorElement).click();
		const samples: number[] = [];
		for (let i = 0; i < 90; i++) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			samples.push(indicator.getBoundingClientRect().top);
		}
		return { start, samples, connected: indicator.isConnected };
	});
	await expect(page).toHaveURL(/\/docs\/components\/alert$/);
	expect(travel.connected).toBe(true);
	const finish = travel.samples.at(-1)!;
	expect(Math.abs(finish - travel.start)).toBeGreaterThan(10);
	expect(
		travel.samples.some(
			(top) => top > Math.min(travel.start, finish) + 1 && top < Math.max(travel.start, finish) - 1
		)
	).toBe(true);
	await expect(navigation.locator('a[aria-current="page"]')).toHaveText('Alert');
	await page.goBack();
	await expect(page).toHaveURL(/\/docs\/components\/accordion$/);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await navigation.getByRole('link', { name: 'Tabs', exact: true }).click();
	await expect(page.locator('[data-doc-slug="tabs"]')).toBeVisible();
	await expect
		.poll(() =>
			navigation.evaluate((root) => {
				const active = root.querySelector('[aria-current="page"]')!.getBoundingClientRect();
				const mark = root
					.querySelector('[data-slot="docs-active-highlight"]')!
					.getBoundingClientRect();
				return Math.max(Math.abs(active.top - mark.top), Math.abs(active.width - mark.width));
			})
		)
		.toBeLessThan(1);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	expect(errors).toEqual([]);
});

test('sidebar shared highlight settles immediately for reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const navigation = page.locator('[data-docs-navigation]');
	await navigation.getByRole('link', { name: 'Alert', exact: true }).click();
	await expect(navigation.locator('[aria-current="page"]')).toHaveText('Alert');
	await expect
		.poll(() =>
			navigation.evaluate((root) => {
				const mark = root.querySelector('[data-slot="docs-active-highlight"]')!;
				return mark.getAnimations().filter((animation) => animation.playState === 'running').length;
			})
		)
		.toBe(0);
});

test('mobile sidebar closes after choosing a documentation page', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/components/accordion');
	await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
	const drawer = page.getByRole('dialog', { name: 'Sidebar', exact: true });
	await drawer.getByRole('link', { name: 'Alert', exact: true }).click();
	await expect(page.locator('[data-doc-slug="alert"]')).toBeVisible();
	await expect(drawer).not.toBeVisible();
	await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
	await expect(drawer.locator('[aria-current="page"]')).toHaveText('Alert');
	await page.keyboard.press('Escape');
	await expect(drawer).not.toBeVisible();
});
