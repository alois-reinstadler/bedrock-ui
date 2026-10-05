import { expect, test } from '../../../../scripts/shared-browser-test';

const recording = {
	trackName: 'On & On',
	artistName: 'Cartoon',
	duration: 208,
	instrumental: false,
	plainLyrics: null,
	syncedLyrics:
		'[00:00.00]Original first test line\n[00:04.00]Original second test line\n[00:08.00]Original third test line'
};

for (const width of [390, 1440]) {
	test(`lyrics follow seeks and visualizer preserves playback at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		await page.route('https://lrclib.net/api/search?**', (route) =>
			route.fulfill({ json: [recording] })
		);
		await page.goto('/templates/music-player/lyrics');
		await expect(page.locator('[data-line="0"]')).toHaveAttribute('aria-current', 'true');
		const lyrics = page.getByRole('link', { name: 'Lyrics', exact: true });
		const visualizer = page.getByRole('link', { name: 'Visualizer', exact: true });
		await expect(lyrics).toBeVisible();
		await expect(visualizer).toBeVisible();
		const a = (await lyrics.boundingBox())!,
			b = (await visualizer.boundingBox())!;
		expect(Math.abs(a.y - b.y)).toBeLessThan(2);
		expect(b.x).toBeGreaterThan(a.x);
		const audio = page.locator('audio');
		await expect
			.poll(() => audio.evaluate((node: HTMLAudioElement) => node.readyState))
			.toBeGreaterThan(0);
		await page.locator('[data-line="2"]').click();
		await expect
			.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
			.toBeCloseTo(8, 1);
		await expect(page.locator('[data-line="2"]')).toHaveAttribute('aria-current', 'true');
		await page.getByRole('button', { name: 'Play current track', exact: true }).click();
		await visualizer.click();
		const canvas = page.locator('canvas');
		await expect(page.getByText('Preparing the visuals…')).toHaveCount(0);
		await expect
			.poll(() => canvas.getAttribute('data-sample-time').then(Number))
			.toBeGreaterThan(8.2);
		const drift = await page.evaluate(() =>
			Math.abs(
				Number(document.querySelector('canvas')?.getAttribute('data-sample-time')) -
					document.querySelector('audio')!.currentTime
			)
		);
		expect(drift).toBeLessThan(0.15);
		await page.getByRole('button', { name: 'Ribbons', exact: true }).click();
		await expect(canvas).toHaveAttribute('aria-label', 'ribbons audio spectrum');
		await page.getByRole('button', { name: 'Freeze visuals', exact: true }).click();
		const frozen = await canvas.getAttribute('data-sample-time');
		await expect
			.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
			.toBeGreaterThan(Number(frozen) + 0.4);
		await expect(canvas).toHaveAttribute('data-sample-time', frozen!);
		await page.getByRole('button', { name: 'Resume visuals', exact: true }).click();
		await page.getByRole('button', { name: 'Pause playback', exact: true }).click();
		await lyrics.click();
		await expect(page.locator('[data-line="2"]')).toHaveAttribute('aria-current', 'true');
		expect(
			await page.locator('main').evaluate((node) => node.scrollWidth <= node.clientWidth)
		).toBe(true);
	});
}

test('lyrics handle failure, retry, untimed lyrics and track changes', async ({ page }) => {
	let request = 0;
	await page.route('https://lrclib.net/api/search?**', (route) => {
		request++;
		return request === 1
			? route.fulfill({ status: 503 })
			: route.fulfill({
					json:
						request === 2
							? [{ ...recording, syncedLyrics: null, plainLyrics: 'Original untimed test words' }]
							: []
				});
	});
	await page.goto('/templates/music-player/lyrics');
	await expect(page.getByText('Lyrics couldn’t load')).toBeVisible();
	await page.getByRole('button', { name: 'Try again' }).click();
	await expect(page.getByText('Timing isn’t available for this recording.')).toBeVisible();
	await page.getByRole('button', { name: 'Next track', exact: true }).click();
	await expect(page.getByText('No lyrics here yet.')).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Heroes Tonight' })).toBeVisible();
});

test('reduced motion keeps visualization still while audio advances', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/templates/music-player/visualizer');
	await page.getByRole('button', { name: 'Play to feel the music' }).click();
	const canvas = page.locator('canvas');
	const initial = await canvas.getAttribute('data-sample-time');
	await expect
		.poll(() => page.locator('audio').evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeGreaterThan(1);
	await expect(canvas).toHaveAttribute('data-sample-time', initial!);
});
