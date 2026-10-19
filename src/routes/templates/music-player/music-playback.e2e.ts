import { expect, test } from '../../../../scripts/shared-browser-test';

for (const collection of ['after-hours', 'slow-mornings']) {
	test(
		`playback advances without seeking itself in ${collection}`,
		{ tag: '@remote-media' },
		async ({ page }) => {
			await page.goto(`/templates/music-player/album/${collection}`);
			await expect(page.locator('[data-music-shell]')).toHaveAttribute('data-ready', 'true');
			const audio = page.locator('audio');
			await audio.evaluate((node: HTMLAudioElement) => {
				node.dataset.seekCount = '0';
				node.addEventListener('seeking', () => {
					node.dataset.seekCount = String(Number(node.dataset.seekCount) + 1);
				});
			});
			await page.getByRole('button', { name: 'Play collection', exact: true }).click();
			await expect
				.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime), {
					timeout: 15000
				})
				.toBeGreaterThan(3);
			await expect(audio).toHaveAttribute('data-seek-count', '0');

			// Hold a scrub position while the audio clock keeps ticking. Only release seeks.
			const track = page.locator('.timeline [data-slot="slider"]');
			const thumb = page.getByRole('slider', { name: 'Seek', exact: true });
			const bounds = (await track.boundingBox())!;
			await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
			await page.mouse.down();
			const preview = Number(await thumb.getAttribute('aria-valuenow'));
			const start = await audio.evaluate((node: HTMLAudioElement) => node.currentTime);
			await expect
				.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
				.toBeGreaterThan(start + 0.6);
			await expect(thumb).toHaveAttribute('aria-valuenow', String(preview));
			await expect(audio).toHaveAttribute('data-seek-count', '0');
			await page.mouse.up();
			await expect(audio).toHaveAttribute('data-seek-count', '1');
			await expect
				.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
				.toBeGreaterThanOrEqual(preview);

			await page.getByRole('button', { name: 'Pause playback', exact: true }).click();
			await thumb.press('Home');
			await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime)).toBe(0);
			await thumb.press('ArrowRight');
			await expect
				.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
				.toBeCloseTo(0.1, 3);
		}
	);
}
