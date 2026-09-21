import { expect, test, type Locator } from '@playwright/test';

async function expectHorizontalContainment(container: Locator, children: Locator) {
	const bounds = await container.boundingBox();
	expect(bounds).not.toBeNull();
	for (const child of await children.all()) {
		if (!(await child.isVisible())) continue;
		const rect = await child.boundingBox();
		expect(rect).not.toBeNull();
		expect(rect!.x).toBeGreaterThanOrEqual(bounds!.x - 1);
		expect(rect!.x + rect!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
	}
}

for (const width of [390, 768, 1440]) {
	for (const colorScheme of ['light', 'dark'] as const) {
		test(`responsive journeys remain readable and reachable: ${width}px ${colorScheme}`, async ({
			page
		}, testInfo) => {
			await page.setViewportSize({ width, height: 900 });
			await page.emulateMedia({ colorScheme });
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			for (const route of [
				'/docs/components/button',
				'/templates/email-client',
				'/templates/music-player',
				'/templates/video-library'
			]) {
				await page.goto(route);
				await page.evaluate(() => document.fonts.ready);
				const theme = page.getByRole('button', { name: 'Toggle color mode' });
				await expect(theme).toBeVisible();
				expect(
					await theme.evaluate((node) => {
						const rect = node.getBoundingClientRect();
						return node.contains(
							document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
						);
					}),
					`${route}: theme control can be reached without scrolling navigation`
				).toBe(true);
				await theme.click();
				await expect
					.poll(() => page.locator('html').evaluate((node) => node.classList.contains('dark')))
					.toBe(colorScheme === 'light');
				await theme.click();
				await expect
					.poll(() => page.locator('html').evaluate((node) => node.classList.contains('dark')))
					.toBe(colorScheme === 'dark');
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth - document.documentElement.clientWidth
					),
					`${route}: no document overflow`
				).toBeLessThanOrEqual(1);
				if (route.endsWith('music-player')) {
					const player = page.getByRole('contentinfo', { name: 'Music player controls' });
					await expectHorizontalContainment(player, player.locator('button, input'));
					await expectHorizontalContainment(
						page.locator('.hero'),
						page.locator('.hero-actions button')
					);
					await player.locator('.now-playing-toggle').click();
					await expect(player).toHaveClass(/expanded/);
					await expectHorizontalContainment(
						player,
						player.locator('button, input, .now-playing-detail')
					);
					await player.getByRole('button', { name: 'Collapse player', exact: true }).click();
					await expect(player).not.toHaveClass(/expanded/);
				}
				await testInfo.attach(`${route.split('/').pop()}-${width}-${colorScheme}`, {
					body: await page.screenshot(),
					contentType: 'image/png'
				});
			}
			expect(errors).toEqual([]);
		});
	}
}

test('tablet music controls fit throughout viewport resizing', async ({ page }) => {
	await page.setViewportSize({ width: 768, height: 900 });
	await page.goto('/templates/music-player');
	await expect(page.locator('audio')).toHaveAttribute('src', /soft-static\.mp3$/);
	const player = page.getByRole('contentinfo', { name: 'Music player controls' });
	for (const width of [768, 800, 960, 761, 760, 390, 768]) {
		await page.setViewportSize({ width, height: 900 });
		await expectHorizontalContainment(player, player.locator('button, input'));
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth
			)
		).toBeLessThanOrEqual(1);
	}
});

for (const colorScheme of ['light', 'dark'] as const) {
	test(`mobile queue close stays below the shared header: ${colorScheme}`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.emulateMedia({ colorScheme });
		await page.goto('/templates/music-player');
		await expect(page.locator('audio')).toHaveAttribute('src', /soft-static\.mp3$/);
		const trigger = page.getByRole('button', { name: 'Queue', exact: true });
		await trigger.click();
		const close = page.getByRole('button', { name: 'Close play queue', exact: true });
		await expect(close).toBeFocused();
		await expect
			.poll(() =>
				close.evaluate((node) => {
					const rect = node.getBoundingClientRect();
					return node.contains(
						document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
					);
				})
			)
			.toBe(true);
		await close.click();
		await expect(close).not.toBeVisible();
		await expect(trigger).toBeFocused();
		// Closing in the same task must cancel the pending async focus transfer.
		await trigger.evaluate((node) => {
			node.click();
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		});
		await expect(close).not.toBeVisible();
		await expect(trigger).toBeFocused();
	});
}
