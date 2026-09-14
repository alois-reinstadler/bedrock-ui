import { expect, test } from '@playwright/test';

const templates = ['music-player', 'video-library', 'email-client', 'social-network'];
const docs = [
	'',
	'/installation',
	'/theming',
	'/skills',
	'/forms',
	'/components',
	'/blocks',
	'/templates'
];

test('top-level documentation shares navigation and reachable content', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	for (const suffix of docs) {
		const response = await page.goto(`/docs${suffix}`);
		expect(response?.status()).toBe(200);
		await expect(page.locator('h1').first()).toBeVisible();
		await expect(
			page
				.getByRole('searchbox', { name: 'Search documentation' })
				.or(page.getByRole('textbox', { name: 'Search documentation' }))
		).toBeVisible();
	}
	expect(errors).toEqual([]);
});

for (const slug of templates) {
	for (const width of [390, 768, 1440]) {
		test(`${slug} at ${width}px in both themes`, async ({ page }) => {
			const errors: string[] = [];
			const failures: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('response', (response) => {
				if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
			});
			await page.setViewportSize({ width, height: 900 });
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.goto(`/templates/${slug}`);
			for (const dark of [false, true]) {
				await page.evaluate(
					(value) => document.documentElement.classList.toggle('dark', value),
					dark
				);
				// Capture settled theme colors rather than an in-flight theme transition.
				await page.waitForTimeout(350);
				await expect(page.locator('h1').first()).toBeVisible();
				await expect(
					page.getByRole('link', { name: 'Back to templates', exact: true })
				).toBeVisible();
				await expect
					.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
					.toBe(true);
				await page.screenshot({
					path: `docs/bedrock/site-expansion/screenshots/${slug}-${width}-${dark ? 'dark' : 'light'}.png`
				});
				if (width === 1440 && !dark)
					await page.screenshot({ path: `static/templates/${slug}.png` });
			}
			expect(errors).toEqual([]);
			expect(failures).toEqual([]);
		});
	}
}

for (const width of [390, 1440]) {
	test(`homepage constellation supports keyboard actions at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto('/');
		const scene = page.getByRole('region', { name: 'Interactive Bedrock component constellation' });
		const live = scene.getByRole('switch', { name: 'Toggle live telemetry' });
		await live.focus();
		await page.keyboard.press('Space');
		await expect(scene.getByText('Telemetry paused')).toBeVisible();
		await scene.getByRole('button', { name: 'Remove Motion' }).click();
		await expect(scene.getByRole('button', { name: 'Remove Motion' })).toHaveCount(0);
		await page.keyboard.press('Control+k');
		const search = scene.getByRole('textbox', { name: 'Search components' });
		await expect(search).toBeFocused();
		await search.fill('command');
		await expect(scene.getByRole('link', { name: 'Command', exact: true })).toHaveAttribute(
			'href',
			'/docs/components/command'
		);
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
			.toBe(true);
		await page.screenshot({ path: `docs/bedrock/site-expansion/screenshots/home-${width}.png` });
		await scene.getByRole('link', { name: 'Command', exact: true }).click();
		await expect(page.locator('[data-doc-slug="command"]')).toBeVisible();
	});
}
