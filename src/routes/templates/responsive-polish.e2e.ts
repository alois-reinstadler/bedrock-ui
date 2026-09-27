import { expect, test } from '@playwright/test';

const templates = ['music-player', 'email-client', 'video-library', 'social-network'];

for (const width of [390, 768, 1440]) {
	for (const colorScheme of ['light', 'dark'] as const) {
		test(`template controls and content fit: ${width}px ${colorScheme}`, async ({
			page
		}, testInfo) => {
			await page.setViewportSize({ width, height: 900 });
			await page.emulateMedia({ colorScheme });
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			for (const slug of templates) {
				await page.goto(`/templates/${slug}`);
				const controls = page.getByRole('region', { name: 'Template preview controls' });
				await expect(controls).toHaveAttribute('data-ready', 'true');
				await expect(controls).toHaveCount(1);
				await page.evaluate(() => document.fonts.ready);
				const theme = controls.getByRole('button', { name: 'Toggle color mode' });
				await expect(theme).toBeVisible();
				expect(
					await theme.evaluate((node) => {
						const rect = node.getBoundingClientRect();
						return node.contains(
							document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
						);
					}),
					`${slug}: floating controls are reachable`
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
					`${slug}: no horizontal overflow`
				).toBeLessThanOrEqual(1);
				const screen = await page.locator('.template-screen').boundingBox();
				expect(screen?.x).toBe(0);
				expect(screen?.y).toBe(0);
				await testInfo.attach(`${slug}-${width}-${colorScheme}`, {
					body: await page.screenshot(),
					contentType: 'image/png'
				});
			}
			expect(errors).toEqual([]);
		});
	}
}

test('mobile watch controls stay reachable beside the floating picker', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/templates/video-library/watch/tears-of-steel');
	await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
		'data-ready',
		'true'
	);
	const play = page.getByRole('button', { name: /^(Play|Pause)$/ });
	await expect(play).toBeVisible();
	expect(
		await play.evaluate((node) => {
			const r = node.getBoundingClientRect();
			return node.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
		})
	).toBe(true);
	await page.locator('video').evaluate((node: HTMLVideoElement) => node.pause());
});
