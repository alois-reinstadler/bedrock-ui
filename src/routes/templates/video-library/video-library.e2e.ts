import { expect, test } from '@playwright/test';

test.describe('Video Library template', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/templates/video-library');
		await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
			'data-ready',
			'true'
		);
	});

	test('searches, saves, and plays a fictional title', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Signal Above' })).toBeVisible();

		await page.getByRole('searchbox', { name: 'Search titles and genres' }).fill('garden');
		await expect(page.getByRole('heading', { name: 'Results for “garden”' })).toBeVisible();
		await expect(page.getByText('After the Rainline', { exact: true })).toBeVisible();

		await page.getByRole('searchbox', { name: 'Search titles and genres' }).fill('');
		await page.getByRole('button', { name: 'Details', exact: true }).click();
		await expect(page.getByRole('dialog')).toContainText(
			'Some messages arrive before they are sent.'
		);
		await page.getByRole('dialog').getByRole('button', { name: 'Play', exact: true }).click();
		const player = page.getByRole('group', { name: 'Signal Above video player' });
		await expect(player).toBeVisible();
		await player.getByRole('button', { name: 'Play', exact: true }).click();
		await expect
			.poll(() => player.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime))
			.toBeGreaterThan(0);
		await expect(player.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
	});

	test('watchlist state is reflected in My list', async ({ page }) => {
		await page.getByRole('button', { name: 'Add Signal Above to watchlist' }).first().click();
		await page.getByRole('button', { name: 'My list', exact: true }).click();
		await expect(page.getByRole('heading', { name: 'My list' })).toBeVisible();
		await expect(page.getByText('Signal Above', { exact: true })).toBeVisible();
	});

	test('mobile navigation remains operable', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.getByRole('button', { name: 'Open navigation' }).click();
		await expect(page.getByRole('navigation', { name: 'Mobile primary' })).toBeVisible();
		await page
			.getByRole('navigation', { name: 'Mobile primary' })
			.getByRole('button', { name: 'My list' })
			.click();
		await expect(page.getByRole('heading', { name: 'My list' })).toBeVisible();
	});
});

test('keyboard shortcuts, dialog focus return, and empty search', async ({ page }) => {
	await page.goto('/templates/video-library');
	await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
		'data-ready',
		'true'
	);
	await page.keyboard.press('/');
	await expect(page.getByRole('searchbox')).toBeFocused();
	await page.getByRole('searchbox').fill('a-title-that-does-not-exist');
	await expect(page.getByRole('heading', { name: 'Nothing matched that search' })).toBeVisible();
	await page.getByRole('button', { name: 'Clear search' }).click();
	const details = page.getByRole('button', { name: 'Details', exact: true });
	await details.click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await expect(page.getByRole('dialog').locator('.film-surface')).toHaveCSS(
		'animation-duration',
		'0.23s'
	);
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).not.toBeVisible();
	await expect(details).toBeFocused();
});

for (const width of [390, 768, 1440]) {
	for (const colorScheme of ['light', 'dark'] as const) {
		test(`${width}px ${colorScheme} layout and reduced motion`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/templates/video-library');
			await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
				'data-ready',
				'true'
			);
			await page.evaluate(
				(dark) => document.documentElement.classList.toggle('dark', dark),
				colorScheme === 'dark'
			);
			await expect(page.getByRole('heading', { name: 'Signal Above' })).toBeVisible();
			await expect
				.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
				.toBe(true);
			await page.getByRole('searchbox').fill('documentary');
			await expect
				.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
				.toBe(true);
		});
	}
}

test('original shorts have distinct media, real seeking, and persisted resume progress', async ({
	page
}) => {
	await page.goto('/templates/video-library');
	await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
		'data-ready',
		'true'
	);
	await page.getByRole('button', { name: 'Original shorts', exact: true }).click();
	await expect(page.locator('#category-results article')).toHaveCount(2);
	await page
		.locator('#category-results')
		.getByRole('button', { name: 'View details for Paper Suns' })
		.click();
	await page.getByRole('dialog').getByRole('button', { name: 'Play', exact: true }).click();
	const player = page.getByRole('group', { name: 'Paper Suns video player' });
	const media = player.locator('video');
	await expect.poll(() => media.evaluate((video: HTMLVideoElement) => video.duration)).toBe(24);
	await expect.poll(() => media.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
	await expect(media.locator('source')).toHaveAttribute(
		'src',
		'/templates/video-library/paper-suns.mp4'
	);
	await player.getByRole('button', { name: 'Play', exact: true }).click();
	await expect
		.poll(() => media.evaluate((video: HTMLVideoElement) => video.currentTime))
		.toBeGreaterThan(0.5);
	await player.getByRole('button', { name: 'Pause', exact: true }).click();
	await player.getByRole('slider', { name: 'Seek' }).focus();
	await page.keyboard.press('ArrowRight');
	await expect
		.poll(() => media.evaluate((video: HTMLVideoElement) => video.currentTime))
		.toBeGreaterThan(5);
	await page.keyboard.press('Escape');
	await page.reload();
	await page.getByRole('button', { name: 'Resume Paper Suns', exact: true }).click();
	await expect
		.poll(() => page.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime))
		.toBeGreaterThanOrEqual(5);
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Details', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Play', exact: true }).click();
	await expect(page.locator('video source')).toHaveAttribute(
		'src',
		'/templates/video-library/signal-above.mp4'
	);
	await expect
		.poll(() => page.locator('video').evaluate((video: HTMLVideoElement) => video.duration))
		.toBe(24);
});

test('watchlist persists and category filtering changes the catalogue', async ({ page }) => {
	await page.goto('/templates/video-library');
	await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
		'data-ready',
		'true'
	);
	await page.getByRole('button', { name: 'Add Signal Above to watchlist' }).first().click();
	await page.reload();
	await expect(
		page.getByRole('button', { name: 'Remove Signal Above from watchlist' }).first()
	).toBeVisible();
	await page.getByRole('button', { name: 'Documentary', exact: true }).click();
	await expect(page.locator('#category-results article')).toHaveCount(3);
	await expect(page.locator('#category-results')).toContainText('Field Notes');
	await expect(page.locator('#category-results')).not.toContainText('Signal Above');
});

test('failed local media offers retry and can recover', async ({ page }) => {
	await page.route('**/signal-above.mp4', (route) => route.abort());
	await page.goto('/templates/video-library');
	await page.getByRole('button', { name: 'Play', exact: true }).first().click();
	const player = page.getByRole('group', { name: 'Signal Above video player' });
	await expect(page.getByTestId('film-error')).toContainText('The local film could not load.');
	await page.unroute('**/signal-above.mp4');
	await page.getByRole('button', { name: 'Reload film', exact: true }).click();
	await expect
		.poll(() => player.locator('video').evaluate((video: HTMLVideoElement) => video.duration))
		.toBe(24);
	await player.getByRole('button', { name: 'Play', exact: true }).click();
	await expect
		.poll(() => player.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime))
		.toBeGreaterThan(0);
});
