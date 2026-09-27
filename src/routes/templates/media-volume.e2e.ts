import { expect, test } from '@playwright/test';

async function setRange(slider: import('@playwright/test').Locator, value: string) {
	await slider.evaluate((node: HTMLInputElement, level) => {
		node.value = level;
		node.dispatchEvent(new Event('input', { bubbles: true }));
	}, value);
}

test('music volume uses the same decibel taper on desktop and in the mobile queue', async ({
	page
}) => {
	await page.goto('/templates/music-player');
	await expect(page.locator('[data-music-shell]')).toHaveAttribute('data-ready', 'true');
	const audio = page.locator('audio');
	await setRange(page.getByRole('slider', { name: 'Volume', exact: true }), '0.5');
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.volume))
		.toBeCloseTo(0.1, 5);
	await expect(page.getByRole('slider', { name: 'Volume', exact: true })).toHaveAttribute(
		'aria-valuetext',
		'50%'
	);
	await page.setViewportSize({ width: 390, height: 844 });
	await page
		.getByRole('button', { name: 'Open queue', exact: true })
		.filter({ visible: true })
		.click();
	const queue = page.getByRole('slider', { name: 'Queue volume' });
	await expect(queue).toHaveValue('0.5');
	await setRange(queue, '0');
	await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.volume)).toBe(0);
	await setRange(queue, '1');
	await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.volume)).toBe(1);
});

for (const width of [390, 1440]) {
	test(`video volume supports taper, mute, keyboard and external media changes at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 844 });
		await page.goto('/templates/video-library/watch/tears-of-steel');
		await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
			'data-ready',
			'true'
		);
		const video = page.locator('video');
		const slider = page.getByRole('slider', { name: 'Volume', exact: true });
		await expect(slider).toBeVisible();
		const box = await slider.boundingBox();
		expect(box!.width).toBeGreaterThanOrEqual(45);
		expect(
			await slider.evaluate((node) => {
				const r = node.getBoundingClientRect();
				return node.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
			})
		).toBe(true);
		await setRange(slider, '50');
		await expect
			.poll(() => video.evaluate((node: HTMLVideoElement) => node.volume))
			.toBeCloseTo(0.1, 5);
		await page.getByRole('button', { name: 'Mute', exact: true }).click();
		await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.muted)).toBe(true);
		await expect(slider).toHaveValue('0');
		await page.getByRole('button', { name: 'Unmute', exact: true }).click();
		await expect(slider).toHaveValue('50');
		await setRange(slider, '0');
		await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.volume)).toBe(0);
		await page.getByRole('button', { name: 'Unmute', exact: true }).click();
		await expect(slider).toHaveValue('50');
		await slider.focus();
		await slider.press('ArrowRight');
		await expect(slider).toHaveValue('51');
		await video.evaluate((node: HTMLVideoElement) => {
			node.volume = 1;
			node.pause();
		});
		await expect(slider).toHaveValue('100');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}
