import { expect, test } from '@playwright/test';

test('music search, playback, saved songs, and keyboard range controls', async ({ page }) => {
	await page.goto('/templates/music-player');
	await expect(
		page.getByRole('heading', { name: 'Signals After Dark', exact: true })
	).toBeVisible();
	await page.getByRole('button', { name: 'Play album', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Next song', exact: true }).click();
	await expect(page.locator('.playing-track')).toContainText('North Window');
	await page.getByRole('button', { name: 'Pause', exact: true }).focus();
	await page.keyboard.press('Space');
	await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
	const volume = page.getByRole('slider', { name: 'Volume', exact: true });
	await volume.focus();
	await page.keyboard.press('Home');
	await expect(volume).toHaveValue('0');
	await page.getByRole('searchbox', { name: 'Search music' }).fill('Nilo');
	await expect(page.locator('.track-row')).toHaveCount(2);
	await page.getByRole('searchbox', { name: 'Search music' }).fill('unfindable track');
	await expect(page.getByRole('heading', { name: 'No songs found' })).toBeVisible();
	await page.getByRole('button', { name: 'Liked songs', exact: true }).click();
	await expect(page.locator('.track-row')).toHaveCount(2);
});

test('compact music player supports queue and mobile track playback', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/templates/music-player');
	await page.getByRole('button', { name: 'Listen to North Window', exact: true }).click();
	await expect(page.locator('.playing-track')).toContainText('North Window');
	await page.getByRole('button', { name: 'Queue', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Play queue', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Close play queue', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Play queue', exact: true })).not.toBeVisible();
	await expect(page.getByRole('slider', { name: 'Volume', exact: true })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
});

test('native audio advances, seeks, changes source, repeats, and stops on navigation', async ({
	page
}) => {
	await page.goto('/templates/music-player');
	const audio = page.locator('audio');
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.readyState))
		.toBeGreaterThan(0);
	await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.paused)).toBe(true);
	await page.getByRole('button', { name: 'Play album', exact: true }).click();
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeGreaterThan(0.5);
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.duration))
		.toBeGreaterThan(30);
	await page.getByRole('slider', { name: 'Song position' }).evaluate((node: HTMLInputElement) => {
		node.value = '12';
		node.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeGreaterThanOrEqual(12);
	await page.getByRole('button', { name: 'Toggle repeat' }).click();
	await audio.evaluate((node: HTMLAudioElement) => {
		node.currentTime = node.duration - 0.15;
	});
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeLessThan(3);
	await expect(audio).toHaveAttribute('src', '/templates/music-player/soft-static.mp3');
	await page.getByRole('button', { name: 'Next song', exact: true }).click();
	await expect(audio).toHaveAttribute('src', '/templates/music-player/north-window.mp3');
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeGreaterThan(0.2);
	await page.getByRole('button', { name: 'Pause', exact: true }).click();
	await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.paused)).toBe(true);
	await page
		.getByRole('slider', { name: 'Volume', exact: true })
		.evaluate((node: HTMLInputElement) => {
			node.value = '25';
			node.dispatchEvent(new Event('input', { bubbles: true }));
		});
	await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.volume)).toBe(0.25);
	await page.getByRole('button', { name: 'Play', exact: true }).click();
	await page.getByRole('link', { name: 'Back to templates', exact: true }).click();
	await expect(page.locator('audio')).toHaveCount(0);
});

test('saved albums, liked songs, and linked library views survive reload', async ({ page }) => {
	await page.goto('/templates/music-player?view=home&album=little-machines');
	await expect(page.getByRole('heading', { name: 'Little Machines', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Save album', exact: true }).click();
	await page.getByRole('button', { name: 'Your library', exact: true }).click();
	await expect(page).toHaveURL(/view=library/);
	await expect(page.locator('.album-grid').first()).toContainText('Little Machines');
	await page.reload();
	await expect(page.getByRole('heading', { name: 'Saved for later', exact: true })).toBeVisible();
	await expect(page.locator('.album-grid').first()).toContainText('Little Machines');
	await page.getByRole('button', { name: 'Open liked songs', exact: true }).click();
	await expect(page.locator('.track-row')).toHaveCount(2);
	await page
		.getByRole('button', { name: 'Remove Slow Current from favorites', exact: true })
		.click();
	await expect(page.locator('.track-row')).toHaveCount(1);
	await page.reload();
	await expect(page.locator('.track-row')).toHaveCount(1);
});

test('mobile now-playing exposes full transport and queue editing', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/templates/music-player');
	await page.locator('.now-playing-toggle').click();
	await expect(page.getByRole('slider', { name: 'Song position' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Next song', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Collapse player', exact: true }).click();
	await page.getByRole('button', { name: 'Queue', exact: true }).click();
	await page.getByRole('button', { name: 'Remove North Window from queue', exact: true }).click();
	await expect(page.locator('.queue-list')).not.toContainText('North Window');
	await page.keyboard.press('Escape');
	await expect(page.getByRole('button', { name: 'Queue', exact: true })).toBeFocused();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('a failed media request has an actionable retry state', async ({ page }) => {
	await page.route('**/templates/music-player/soft-static.mp3', (route) => route.abort());
	await page.goto('/templates/music-player');
	await expect(page.getByRole('alert')).toContainText('could not be loaded');
	await page.unroute('**/templates/music-player/soft-static.mp3');
	await page.getByRole('button', { name: 'Retry playback', exact: true }).click();
	await expect
		.poll(() => page.locator('audio').evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeGreaterThan(0.2);
	await expect(page.getByRole('alert')).toHaveCount(0);
});

test('tablet library and track grids fit inside the main scroll region', async ({ page }) => {
	await page.setViewportSize({ width: 768, height: 1024 });
	await page.goto('/templates/music-player');
	expect(
		await page.locator('#music-main').evaluate((node) => node.scrollWidth <= node.clientWidth)
	).toBe(true);
	await page.getByRole('button', { name: 'Your library', exact: true }).click();
	expect(
		await page.locator('#music-main').evaluate((node) => node.scrollWidth <= node.clientWidth)
	).toBe(true);
	await page.goBack();
	await expect(
		page.getByRole('heading', { name: 'Signals After Dark', exact: true })
	).toBeVisible();
});
