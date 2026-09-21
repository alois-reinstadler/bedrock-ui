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

test('search clearing retains the indicator and realigns it with the selected link', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const navigation = page.locator('[data-docs-navigation]');
	const highlight = navigation.locator('[data-slot="docs-active-highlight"]');
	await expect(highlight).toBeVisible();
	const original = await highlight.elementHandle();
	const search = page.getByRole('textbox', { name: 'Search documentation' });
	await search.fill('zzmissing');
	await expect(page.getByText('No documentation found.')).toBeVisible();
	await expect(highlight).toBeHidden();
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await search.fill('');
	await expect(search).toBeFocused();
	await expect(highlight).toBeVisible();
	await expect
		.poll(() =>
			navigation.evaluate((root) => {
				const active = root.querySelector('[aria-current="page"]')!.getBoundingClientRect();
				const mark = root
					.querySelector('[data-slot="docs-active-highlight"]')!
					.getBoundingClientRect();
				return Math.abs(active.top - mark.top);
			})
		)
		.toBeLessThan(1);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
});

test('breadcrumb, catalogue, and primary links preserve the docs document and sidebar scroll', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const original = await page.locator('[data-docs-navigation]').elementHandle();
	const viewport = page.locator('[data-slot="sidebar-inner"] [data-slot="scroll-area-viewport"]');
	await viewport.evaluate((node) => {
		node.scrollTop = 300;
	});
	const scrollTop = await viewport.evaluate((node) => node.scrollTop);
	await page
		.getByRole('navigation', { name: 'breadcrumb' })
		.getByRole('link', { name: 'Components', exact: true })
		.click();
	await expect(page).toHaveURL(/\/docs\/components$/);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	expect(await viewport.evaluate((node) => node.scrollTop)).toBe(scrollTop);
	const card = page.locator('main a[href="/docs/components/accordion"]');
	await card.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('[data-doc-slug="accordion"]')).toBeVisible();
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await page
		.getByRole('navigation', { name: 'Primary' })
		.getByRole('link', { name: 'Blocks', exact: true })
		.click();
	await expect(page).toHaveURL(/\/docs\/blocks$/);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await page.goBack();
	await expect(page.locator('[data-doc-slug="accordion"]')).toBeVisible();
	await page.goForward();
	await expect(page).toHaveURL(/\/docs\/blocks$/);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	expect(errors).toEqual([]);
});

for (const overlay of [
	{ slug: 'dialog', trigger: 'Open dialog', selector: '[data-slot="dialog-content"]' },
	{ slug: 'popover', trigger: 'Column widths', selector: '[data-slot="popover-content"]' }
]) {
	test(`history navigation tears down an open ${overlay.slug} without trapping focus`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto('/docs/components/accordion');
		const original = await page.locator('[data-docs-navigation]').elementHandle();
		await page
			.locator('[data-docs-navigation]')
			.locator(`a[href="/docs/components/${overlay.slug}"]`)
			.click();
		await page
			.locator('#preview')
			.getByRole('button', { name: overlay.trigger, exact: true })
			.click();
		await expect(page.locator(overlay.selector)).toBeVisible();
		await page.goBack();
		await expect(page.locator('[data-doc-slug="accordion"]')).toBeVisible();
		await expect(page.locator(overlay.selector)).toHaveCount(0);
		expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
		const search = page.getByRole('textbox', { name: 'Search documentation' });
		await search.focus();
		await expect(search).toBeFocused();
		await search.fill('alert');
		await page.locator('[data-docs-navigation] a[href="/docs/components/alert"]').click();
		await expect(page.locator('[data-doc-slug="alert"]')).toBeVisible();
		expect(errors).toEqual([]);
	});
}

test('block reference exits to the catalogue without reading another route data shape', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/blocks/authentication-panel');
	const original = await page.locator('[data-docs-navigation]').elementHandle();
	await expect(page.locator('[data-doc-slug="authentication-panel"]')).toBeVisible();
	await page
		.getByRole('navigation', { name: 'breadcrumb' })
		.getByRole('link', { name: 'Blocks', exact: true })
		.click();
	await expect(page).toHaveURL(/\/docs\/blocks$/);
	await expect(
		page.locator('main').getByRole('heading', { name: 'Blocks', exact: true })
	).toBeVisible();
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await page.goBack();
	await expect(page.locator('[data-doc-slug="authentication-panel"]')).toBeVisible();
	expect(errors).toEqual([]);
});
