import { expect, test } from '@playwright/test';

import { tracks } from '../../../lib/templates/music-player/data.js';

const base = '/templates/music-player';
async function ready(page: import('@playwright/test').Page) {
	await expect(page.locator('[data-music-shell]')).toHaveAttribute('data-ready', 'true');
}

test('music uses real routes while preserving shell, album frame, and playing audio', async ({
	page
}) => {
	await page.goto(`${base}/album/after-hours`);
	await ready(page);
	await page.getByRole('button', { name: 'Play collection', exact: true }).click();
	const audio = page.locator('audio');
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeGreaterThan(0.2);
	const shell = await page.locator('[data-music-shell]').elementHandle();
	const player = await page.locator('[data-music-player]').elementHandle();
	const frame = await page.locator('[data-album-layout]').elementHandle();
	const audioElement = await audio.elementHandle();
	const time = await audio.evaluate((node: HTMLAudioElement) => node.currentTime);
	await page
		.getByRole('navigation', { name: 'Collections', exact: true })
		.getByRole('link', { name: 'Melodic Rush' })
		.click();
	await expect(page).toHaveURL(`${base}/album/slow-mornings`);
	await expect(page.getByRole('heading', { name: 'Melodic Rush', exact: true })).toBeVisible();
	expect(
		await shell?.evaluate((node) => node === document.querySelector('[data-music-shell]'))
	).toBe(true);
	expect(
		await player?.evaluate((node) => node === document.querySelector('[data-music-player]'))
	).toBe(true);
	expect(
		await frame?.evaluate((node) => node === document.querySelector('[data-album-layout]'))
	).toBe(true);
	expect(await audioElement?.evaluate((node) => node === document.querySelector('audio'))).toBe(
		true
	);
	await expect(audio).toHaveAttribute('src', tracks.find((track) => track.id === 'mortals')!.audio);
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeGreaterThan(time);
	await expect(page.locator('[data-song-row]')).toHaveCount(2);
	await page.goBack();
	await expect(page.getByRole('heading', { name: 'Bass Anthems', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Next track', exact: true }).click();
	await expect(audio).toHaveAttribute(
		'src',
		tracks.find((track) => track.id === 'invincible')!.audio
	);
	await page.getByRole('button', { name: 'Pause playback', exact: true }).click();
	await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.paused)).toBe(true);
});

test('music search and genre filters are query parameters and likes persist', async ({ page }) => {
	await page.goto(`${base}/discover`);
	await ready(page);
	await page.getByRole('button', { name: 'House', exact: true }).click();
	await expect(page).toHaveURL(/\/discover\?genre=House/);
	await expect(page.locator('[data-song-row]')).toHaveCount(2);
	await page.getByRole('button', { name: 'Like Sky High', exact: true }).click();
	await page.getByRole('link', { name: 'Liked songs', exact: true }).click();
	await expect(page).toHaveURL(`${base}/liked`);
	await expect(page.locator('[data-track-list]')).toHaveCount(1);
	await expect(page.locator('[data-track-list]')).toContainText('Sky High');
	await page.reload();
	await ready(page);
	await expect(page.locator('[data-track-list]')).toContainText('Sky High');
	const search = page.getByRole('textbox', { name: 'Search music' });
	await search.fill('On & On');
	await search.press('Enter');
	await expect(page).toHaveURL(`${base}/discover?q=On+%26+On`);
	await expect(page.locator('[data-song-row]')).toHaveCount(1);
	await expect(page.locator('[data-track-list]')).toContainText('On & On');
});

test('remote music recordings expose correct duration, attribution, and seek controls', async ({
	page
}) => {
	await page.goto(`${base}/album/sunday-drive`);
	await ready(page);
	await page.getByRole('button', { name: 'Play collection', exact: true }).click();
	const audio = page.locator('audio');
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.duration))
		.toBeGreaterThan(200);
	await page
		.getByRole('slider', { name: 'Seek', exact: true })
		.evaluate((node: HTMLInputElement) => {
			node.value = '42';
			node.dispatchEvent(new Event('input', { bubbles: true }));
		});
	await expect
		.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
		.toBeGreaterThanOrEqual(42);
	await expect(audio).toHaveAttribute(
		'src',
		tracks.find((track) => track.id === 'heroes-tonight')!.audio
	);
	expect(await audio.evaluate((node: HTMLAudioElement) => node.error)).toBeNull();
	await page.getByRole('link', { name: 'Track credits', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Music & credits', exact: true })).toBeVisible();
	await expect(
		page.locator('.credits-copy').getByRole('link', { name: 'NoCopyrightSounds', exact: true })
	).toHaveAttribute('href', 'https://ncs.io/');
	await expect(page.getByRole('link', { name: 'Official NCS release ↗' })).toHaveCount(8);
});

test('compact player exposes queue and volume without overflow and honors reduced motion', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto(`${base}/album/after-hours`);
	await ready(page);
	await page.getByRole('button', { name: 'Play collection', exact: true }).click();
	await page.getByRole('button', { name: 'Open queue', exact: true }).click();
	const volume = page.getByRole('slider', { name: 'Queue volume', exact: true });
	await volume.focus();
	await page.keyboard.press('Home');
	await expect
		.poll(() => page.locator('audio').evaluate((node: HTMLAudioElement) => node.volume))
		.toBe(0);
	await page.getByRole('button', { name: 'Close queue', exact: true }).click();
	await page.locator('main').getByRole('link', { name: 'Melodic Rush' }).click();
	await expect(page).toHaveURL(`${base}/album/slow-mornings`);
	await expect(page.locator('[data-album-title]')).toHaveCount(1);
	expect(
		await page
			.locator('[data-album-layout]')
			.evaluate(
				(node) =>
					node
						.getAnimations({ subtree: true })
						.filter((animation) => animation.playState === 'running').length
			)
	).toBe(0);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('all eight remote NCS recordings decode, play and expose their full measured duration', async ({
	page
}) => {
	await page.goto(`${base}/discover`);
	await ready(page);
	const audio = page.locator('audio');
	for (const [id, title, duration] of [
		['on-and-on', 'On & On', 208.013],
		['heroes-tonight', 'Heroes Tonight', 208.091],
		['mortals', 'Mortals', 228.389],
		['my-heart', 'My Heart', 267.102],
		['invincible', 'Invincible', 273.084],
		['sky-high', 'Sky High', 236.304],
		['blank', 'Blank', 209.058],
		['why-we-lose', 'Why We Lose', 213.055]
	] as const) {
		await page.getByRole('button', { name: `Play ${title}`, exact: true }).click();
		await expect(audio).toHaveAttribute('src', tracks.find((track) => track.id === id)!.audio);
		await expect
			.poll(() => audio.evaluate((node: HTMLAudioElement) => node.duration))
			.toBeCloseTo(duration, 1);
		await expect
			.poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
			.toBeGreaterThan(0.1);
		expect(await audio.evaluate((node: HTMLAudioElement) => node.error)).toBeNull();
	}
	await page.getByRole('button', { name: 'Pause playback', exact: true }).click();
});

test('album changes animate outgoing and incoming cover, title words and song rows', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto(`${base}/album/after-hours`);
	await ready(page);
	await expect
		.poll(() =>
			page
				.locator('[data-album-layout]')
				.evaluate((node) => node.getAnimations({ subtree: true }).length)
		)
		.toBe(0);
	const transition = await page.evaluate(async () => {
		const frame = document.querySelector('[data-album-layout]');
		document
			.querySelector<HTMLAnchorElement>('nav[aria-label="Collections"] a[href$="slow-mornings"]')!
			.click();
		while (!location.pathname.endsWith('/slow-mornings'))
			await new Promise((resolve) => setTimeout(resolve, 5));
		await new Promise(requestAnimationFrame);
		await new Promise(requestAnimationFrame);
		const moving = (selector: string) =>
			[...document.querySelectorAll(selector)].filter((node) =>
				node.getAnimations().some((animation) => animation.playState === 'running')
			).length;
		return {
			sameFrame: frame === document.querySelector('[data-album-layout]'),
			covers: moving('[data-album-cover]'),
			words: moving('[data-album-title] span'),
			rows: moving('[data-song-row]'),
			translatesContent: [
				...document.querySelectorAll('[data-album-cover], [data-album-title] span, [data-song-row]')
			].some((node) =>
				node
					.getAnimations()
					.some((animation) =>
						(animation.effect as KeyframeEffect)
							.getKeyframes()
							.some((keyframe) => keyframe.transform && keyframe.transform !== 'none')
					)
			)
		};
	});
	expect(transition.sameFrame).toBe(true);
	expect(transition.covers).toBe(2);
	expect(transition.words).toBe(4);
	expect(transition.rows).toBe(4);
	expect(transition.translatesContent).toBe(false);
	await expect(page.locator('[data-album-title]')).toHaveCount(1);
	await expect(page.locator('[data-song-row]')).toHaveCount(2);
});

for (const width of [390, 768, 1440]) {
	test(`album content anchors remain stable through fades at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.goto(`${base}/album/after-hours`);
		await ready(page);
		await page.evaluate(() => document.fonts.ready);
		const anchors = () =>
			page.evaluate(() => {
				const selectors = [
					'[data-album-layout]',
					'.cover-stage',
					'.title-stage',
					'.description',
					'.album-meta',
					'.album-actions',
					'[data-track-list]'
				];
				return selectors.map((selector) => {
					const { x, y, width, height } = document.querySelector(selector)!.getBoundingClientRect();
					return { selector, x, y, width, height };
				});
			});
		const initial = await anchors();
		for (const slug of ['the-lounge', 'slow-mornings', 'sunday-drive', 'after-hours']) {
			// Programmatic link activation leaves the independently scrolling music pane in place.
			await page
				.locator(`main a[href="${base}/album/${slug}"]`)
				.evaluate((node: HTMLAnchorElement) => node.click());
			await expect(page).toHaveURL(`${base}/album/${slug}`);
			await page.evaluate(
				() =>
					new Promise<void>((resolve) =>
						requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
					)
			);
			const during = await anchors();
			await expect(page.locator('[data-album-title]')).toHaveCount(1);
			await expect(page.locator('[data-track-layer]')).toHaveCount(1);
			const settled = await anchors();
			for (const positions of [during, settled]) {
				positions.forEach((position, index) => {
					for (const dimension of ['x', 'y', 'width', 'height'] as const) {
						expect(
							Math.abs(position[dimension] - initial[index][dimension]),
							`${position.selector} ${dimension} for ${slug}`
						).toBeLessThanOrEqual(1);
					}
				});
			}
		}
		// A second navigation during an unfinished fade must not leave stale layers behind.
		await page.evaluate(async () => {
			for (const slug of ['slow-mornings', 'the-lounge', 'sunday-drive']) {
				document.querySelector<HTMLAnchorElement>(`main a[href$="/album/${slug}"]`)!.click();
				while (!location.pathname.endsWith(`/${slug}`))
					await new Promise((resolve) => setTimeout(resolve, 5));
				await new Promise(requestAnimationFrame);
			}
		});
		await expect(page.locator('[data-album-title]')).toHaveCount(1);
		await expect(page.locator('[data-album-cover]')).toHaveCount(1);
		await expect(page.locator('[data-track-layer]')).toHaveCount(1);
		expect(await anchors()).toEqual(initial);
	});
}
