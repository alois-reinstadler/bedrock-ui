import { expect, test } from '../../../../scripts/shared-browser-test';

for (const width of [390, 768, 1440]) {
	test(`album artwork hands off continuously to the fixed header at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 740 });
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto('/templates/music-player/album/after-hours');
		await expect(page.locator('[data-music-shell]')).toHaveAttribute('data-ready', 'true');
		await page.evaluate(() => document.fonts.ready);
		const pane = page.locator('#music-main');
		const compact = page.locator('[data-album-compact]');
		const toolbar = page.locator('[data-album-topbar]');
		const toolbarTop = (await toolbar.boundingBox())!.y;
		await expect(compact).toHaveCSS('opacity', '0');
		await expect(compact).toHaveAttribute('inert', '');
		const geometry = await page.evaluate(() => {
			const pane = document.querySelector<HTMLElement>('#music-main')!;
			const header = document.querySelector<HTMLElement>('[data-album-layout]')!;
			return {
				distance: header.offsetHeight + parseFloat(getComputedStyle(pane).paddingTop),
				trackOffset:
					document.querySelector('[data-track-list]')!.getBoundingClientRect().top -
					pane.getBoundingClientRect().top +
					pane.scrollTop
			};
		});
		const samples: { scale: number; opacity: number; reveal: number }[] = [];
		for (const progress of [0.25, 0.5, 0.65, 0.8, 1]) {
			await pane.evaluate((node, offset) => {
				node.scrollTop = offset;
			}, geometry.distance * progress);
			await page.evaluate(
				() =>
					new Promise<void>((resolve) =>
						requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
					)
			);
			samples.push(
				await page.locator('.cover-stage').evaluate((node) => ({
					scale: new DOMMatrix(getComputedStyle(node).transform).a,
					opacity: Number(getComputedStyle(node).opacity),
					reveal: Number(getComputedStyle(document.querySelector('[data-album-compact]')!).opacity)
				}))
			);
			expect((await toolbar.boundingBox())!.y).toBe(toolbarTop);
			expect(
				await pane.evaluate(
					(node) =>
						document.querySelector('[data-track-list]')!.getBoundingClientRect().top -
						node.getBoundingClientRect().top +
						node.scrollTop
				)
			).toBeCloseTo(geometry.trackOffset, 0);
		}
		for (let i = 1; i < samples.length; i++) {
			expect(samples[i].scale).toBeLessThan(samples[i - 1].scale);
			expect(samples[i].opacity).toBeLessThan(samples[i - 1].opacity);
			expect(samples[i].reveal).toBeGreaterThanOrEqual(samples[i - 1].reveal);
		}
		expect(samples[2].reveal).toBeGreaterThan(0);
		expect(samples[2].reveal).toBeLessThan(1);
		await expect(compact).toHaveCSS('opacity', '1');
		await expect(compact).not.toHaveAttribute('inert');
		await expect(
			compact.getByRole('button', { name: 'Play collection from header' })
		).toBeVisible();
		await expect(toolbar.getByRole('link', { name: 'Search music' })).toBeVisible();
		expect(await pane.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);

		// Reversing scroll restores geometry and transfers focus before hiding the control.
		await compact.getByRole('button', { name: 'Play collection from header' }).focus();
		await pane.evaluate((node) => {
			node.scrollTop = 0;
		});
		await expect(compact).toHaveCSS('opacity', '0');
		await expect(compact).toHaveAttribute('inert', '');
		await expect(toolbar.getByRole('link', { name: 'Back to music' })).toBeFocused();
		await expect(page.locator('.cover-stage')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
		await page.getByRole('button', { name: 'In your library', exact: true }).click();
		await expect(
			page.getByRole('button', { name: 'Save collection', exact: true })
		).toHaveAttribute('aria-pressed', 'false');
		await pane.evaluate((node) => {
			node.scrollTop = 180;
		});
		await page
			.locator('main a[href$="/album/slow-mornings"]')
			.evaluate((node: HTMLAnchorElement) => node.click());
		await expect(compact).toContainText('Melodic Rush');
		await expect.poll(() => pane.evaluate((node) => node.scrollTop)).toBe(0);
		await expect(compact).toHaveCSS('opacity', '0');
	});
}

test('reduced motion keeps the fixed album title without scale or parallax', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 740 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/templates/music-player/album/after-hours');
	await expect(page.locator('[data-music-shell]')).toHaveAttribute('data-ready', 'true');
	await page.locator('#music-main').evaluate((node) => {
		node.scrollTop = node.scrollHeight;
	});
	await expect(page.locator('.compact-album')).toHaveCSS('opacity', '1');
	for (const selector of ['.cover-stage', '.title-stage', '.compact-album']) {
		await expect(page.locator(selector)).toHaveCSS('transform', 'none');
	}
});
