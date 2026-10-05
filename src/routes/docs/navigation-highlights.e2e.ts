import { expect, test } from '../../../scripts/shared-browser-test';

// Examples load lazily after the documentation shell hydrates.
test.setTimeout(60_000);

test('documentation tabs align their underline after full navigation and history', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/sidebar');
	const nav = page.getByRole('navigation', { name: 'Sidebar documentation' });
	const mark = nav.locator('[data-slot="doc-tabs-indicator"]');
	for (const label of ['Properties', 'Accessibility', 'Overview']) {
		const link = nav.getByRole('link', { name: label, exact: true });
		await expect(link).toHaveAttribute('data-sveltekit-reload', '');
		await link.click();
		await expect(link).toHaveAttribute('aria-current', 'page');
		await expect(mark).toBeVisible();
		await expect(mark).toHaveCount(1);
		await expect
			.poll(async () =>
				nav.evaluate((root) => {
					const indicator = root
						.querySelector('[data-slot="doc-tabs-indicator"]')!
						.getBoundingClientRect();
					const selected = root.querySelector('a[aria-current="page"]')!.getBoundingClientRect();
					return Math.max(
						Math.abs(indicator.x - selected.x),
						Math.abs(indicator.width - selected.width)
					);
				})
			)
			.toBeLessThan(1);
		if (label !== 'Overview') {
			await expect(page.locator(`[data-doc-tab="${label.toLowerCase()}"]`)).toBeVisible();
		}
	}
	await page.goBack({ waitUntil: 'commit' });
	await expect(nav.getByRole('link', { name: 'Accessibility', exact: true })).toHaveAttribute(
		'aria-current',
		'page'
	);
	await expect(mark).toBeVisible();
	expect(errors).toEqual([]);
});

test('the reusable Sidebar moves its active and hover surfaces and keeps instances independent', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/docs/components/sidebar');
	const scopes = page.locator('[data-sidebar-highlights]');
	await expect(scopes).toHaveCount(2, { timeout: 20_000 });
	const root = scopes.first();
	await root.scrollIntoViewIfNeeded();
	const active = root.locator('[data-slot="sidebar-active-highlight"]');
	await expect(active).toBeVisible();
	const motion = await root.evaluate(async (root) => {
		const mark = root.querySelector<HTMLElement>('[data-slot="sidebar-active-highlight"]')!;
		const target = root.querySelectorAll<HTMLButtonElement>('[data-sidebar="menu-button"]')[2];
		const start = mark.getBoundingClientRect().y;
		target.click();
		const samples: number[] = [];
		const t = performance.now();
		do {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			samples.push(mark.getBoundingClientRect().y);
		} while (performance.now() - t < 600);
		return { start, end: target.getBoundingClientRect().y, samples, connected: mark.isConnected };
	});
	expect(motion.connected).toBe(true);
	expect(motion.samples.some((y) => y > motion.start + 1 && y < motion.end - 1)).toBe(true);
	await expect(root.getByRole('button', { name: 'Settings' })).toHaveAttribute(
		'data-active',
		'true'
	);
	await expect(scopes.nth(1).getByRole('button', { name: 'Overview' })).toHaveAttribute(
		'data-active',
		'true'
	);
	const hover = root.locator('[data-slot="sidebar-hover-highlight"]');
	await root.getByRole('button', { name: 'Overview' }).hover();
	await expect(hover.locator('[data-hover-surface]')).toHaveCSS('opacity', '1');
	const original = await hover.elementHandle();
	const travel = await root.evaluate(async (root) => {
		const mark = root.querySelector<HTMLElement>('[data-slot="sidebar-hover-highlight"]')!;
		const target = root.querySelectorAll<HTMLElement>('[data-sidebar="menu-button"]')[1];
		const start = mark.getBoundingClientRect().y;
		target.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
		const samples: number[] = [];
		const t = performance.now();
		do {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			samples.push(mark.getBoundingClientRect().y);
		} while (performance.now() - t < 250);
		return { start, end: target.getBoundingClientRect().y, samples };
	});
	expect(travel.samples.some((y) => y > travel.start + 1 && y < travel.end - 1)).toBe(true);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await page.mouse.move(1200, 100);
	await expect(hover).toBeHidden();
	await expect(hover.locator('[data-hover-surface]')).toHaveCSS('opacity', '0');
});

for (const reduced of [false, true]) {
	test(`reusable Sidebar ${reduced ? 'settles immediately' : 'fades and slides locally'} when the previous active row is clipped`, async ({
		page
	}) => {
		await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
		await page.goto('/docs/components/sidebar');
		const root = page.locator('[data-sidebar-highlights]').first();
		await expect(root).toBeVisible({ timeout: 20_000 });
		await root.scrollIntoViewIfNeeded();
		await expect(root.locator('[data-slot="sidebar-active-highlight"]')).toBeVisible();
		await root.locator('[data-slot="sidebar-content"]').evaluate((content) => {
			content.style.cssText = 'height: 70px; max-height: 70px; flex: 0 0 70px; overflow: auto';
			content.scrollTop = content.scrollHeight;
		});
		await expect(root.locator('[data-slot="sidebar-active-highlight"]')).toBeHidden();
		const samples = await root.evaluate(async (root) => {
			const mark = root.querySelector<HTMLElement>('[data-slot="sidebar-active-highlight"]')!;
			const target = root.querySelectorAll<HTMLButtonElement>('[data-sidebar="menu-button"]')[2];
			target.click();
			const samples: { offset: number; opacity: number }[] = [];
			const t = performance.now();
			do {
				await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
				samples.push({
					offset: mark.getBoundingClientRect().y - target.getBoundingClientRect().y,
					opacity: Number(getComputedStyle(mark).opacity)
				});
			} while (performance.now() - t < 350);
			return samples;
		});
		expect(samples.every(({ offset }) => Math.abs(offset) < 3.1)).toBe(true);
		expect(samples.at(-1)!.opacity).toBe(1);
		if (reduced) expect(samples.every(({ opacity }) => opacity === 1)).toBe(true);
		else
			expect(samples.some(({ opacity, offset }) => opacity > 0 && opacity < 1 && offset > 0)).toBe(
				true
			);
	});
}
