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
