import { expect, test } from '@playwright/test';
import { filmSources } from '../../../lib/templates/media.js';
const base = '/templates/video-library';

test('browse, film details and playback are separate real routes', async ({ page }) => {
	await page.goto(base);
	await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
		'data-ready',
		'true'
	);
	await page.getByRole('link', { name: 'More info' }).click();
	await expect(page).toHaveURL(`${base}/title/tears-of-steel`);
	await expect(page.getByRole('heading', { name: 'Tears of Steel', exact: true })).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await page.getByRole('link', { name: 'Play film', exact: true }).click();
	await expect(page).toHaveURL(`${base}/watch/tears-of-steel`);
	const video = page.locator('video');
	await expect
		.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState))
		.toBeGreaterThan(0);
	await expect
		.poll(() => video.evaluate((element: HTMLVideoElement) => element.duration))
		.toBeGreaterThan(700);
	await video.evaluate((element: HTMLVideoElement) => {
		element.pause();
		element.currentTime = 45;
	});
	await expect
		.poll(() =>
			page.evaluate(
				() =>
					JSON.parse(localStorage.getItem('bedrock-frame-v2') ?? '{}').progress?.['tears-of-steel']
			)
		)
		.toBeGreaterThan(40);
	await page.getByRole('link', { name: 'Back to Tears of Steel' }).click();
	await expect(page).toHaveURL(`${base}/title/tears-of-steel`);
	await page.getByRole('link', { name: 'Browse films' }).click();
	await expect(page.getByRole('heading', { name: 'Pick up where you left off' })).toBeVisible();
	await page.goBack();
	await expect(page).toHaveURL(`${base}/title/tears-of-steel`);
});

test('saved films persist across routes and reload', async ({ page }) => {
	await page.goto(`${base}/title/caminandes`);
	await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
		'data-ready',
		'true'
	);
	await page.getByRole('button', { name: '+ My list', exact: true }).click();
	await page
		.getByRole('navigation', { name: 'Frame navigation' })
		.getByRole('link', { name: /My list/ })
		.click();
	await expect(page).toHaveURL(`${base}/my-list`);
	await expect(
		page.getByRole('link', { name: 'View Caminandes: Gran Dillama', exact: true })
	).toBeVisible();
	await page.reload();
	await expect(
		page.getByRole('link', { name: 'View Caminandes: Gran Dillama', exact: true })
	).toBeVisible();
	await page.getByRole('button', { name: 'Remove Caminandes: Gran Dillama from my list' }).click();
	await expect(
		page.getByRole('heading', { name: 'Your next movie night starts here.' })
	).toBeVisible();
});

test('genre routes, real search filters, account menu and mobile sizing', async ({ page }) => {
	await page.goto(`${base}/genres/animation`);
	await expect(page.getByRole('heading', { name: 'Animation', exact: true })).toBeVisible();
	await page.getByRole('searchbox', { name: 'Search films' }).fill('Sintel');
	await page.getByRole('searchbox', { name: 'Search films' }).press('Enter');
	await expect(page).toHaveURL(`${base}/search?q=Sintel`);
	await expect(page.getByRole('link', { name: 'View Sintel', exact: true })).toBeVisible();
	await expect(page.locator('.film-card')).toHaveCount(1);
	await page.getByLabel('Your account').click();
	await expect(page.getByText('Jamie Davis', { exact: true })).toBeVisible();
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(base);
	await expect
		.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
		.toBe(true);
	await expect(page.getByRole('link', { name: 'Play film', exact: true })).toBeVisible();
});

test('every title loads its own remote film and measured runtime', async ({ page }) => {
	const sources = new Set<string>();
	for (const [slug, minimum, maximum] of [
		['tears-of-steel', 730, 740],
		['caminandes', 145, 148],
		['big-buck-bunny', 595, 598],
		['sintel', 50, 54]
	] as const) {
		await page.goto(`${base}/watch/${slug}`);
		const video = page.locator('video');
		await expect
			.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState))
			.toBeGreaterThan(0);
		const duration = await video.evaluate((element: HTMLVideoElement) => {
			element.pause();
			return element.duration;
		});
		expect(duration).toBeGreaterThanOrEqual(minimum);
		expect(duration).toBeLessThanOrEqual(maximum);
		const source = await video.evaluate((element: HTMLVideoElement) => element.currentSrc);
		expect(source).toBe(filmSources[slug]);
		sources.add(source);
	}
	expect(sources.size).toBe(4);
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
	test(`video route fades preserve the frame (${reducedMotion})`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion });
		await page.goto(base);
		await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
			'data-ready',
			'true'
		);
		await page.evaluate(() => {
			for (const selector of [
				'.frame-app',
				'.frame-header',
				'#frame-content',
				'.preview-controls'
			]) {
				document.querySelector(selector)?.setAttribute('data-original-frame', 'true');
			}
			const original = Element.prototype.animate;
			Element.prototype.animate = function (keyframes, options) {
				const animation = original.call(this, keyframes, options);
				if (this.id === 'frame-content') {
					const root = document.documentElement;
					root.dataset.videoFades = String(Number(root.dataset.videoFades ?? 0) + 1);
					root.dataset.videoFadeFrames = JSON.stringify(
						(animation.effect as KeyframeEffect).getKeyframes().map(({ opacity }) => opacity)
					);
				}
				return animation;
			};
		});
		// SvelteKit changes history before awaiting onNavigate. Wait for rendered content
		// and both fade phases so the next step tests a completed route, not cancellation.
		let completedRoutes = 0;
		async function expectSettledRoute(path: string, contentSelector: string) {
			await expect(page).toHaveURL(`${base}${path}`);
			await expect(page.locator(contentSelector)).toBeVisible();
			completedRoutes += 1;
			if (reducedMotion === 'no-preference') {
				await expect(page.locator('html')).toHaveAttribute(
					'data-video-fades',
					String(completedRoutes * 2)
				);
				await expect
					.poll(() =>
						page
							.locator('#frame-content')
							.evaluate(
								(element) =>
									element.getAnimations().filter((animation) => animation.playState === 'running')
										.length
							)
					)
					.toBe(0);
			}
			await expect(page.locator('#frame-content')).toHaveCSS('opacity', '1');
		}
		await page.getByRole('link', { name: 'More info' }).click();
		await expectSettledRoute('/title/tears-of-steel', '.detail-title');
		for (const selector of ['.frame-app', '.frame-header', '#frame-content', '.preview-controls']) {
			await expect(page.locator(selector)).toHaveAttribute('data-original-frame', 'true');
		}
		if (reducedMotion === 'reduce') {
			await expect(page.locator('html')).not.toHaveAttribute('data-video-fades');
		} else {
			await expect(page.locator('html')).toHaveAttribute('data-video-fades', '2');
			await expect(page.locator('html')).toHaveAttribute('data-video-fade-frames', '["0.45","1"]');
		}
		await page.getByRole('link', { name: 'Play film', exact: true }).click();
		await expectSettledRoute('/watch/tears-of-steel', '.watch-screen');
		await page.getByRole('link', { name: 'Back to Tears of Steel' }).click();
		await expectSettledRoute('/title/tears-of-steel', '.detail-title');
		await page
			.getByRole('navigation', { name: 'Frame navigation' })
			.getByRole('link', { name: /My list/ })
			.click();
		await expectSettledRoute('/my-list', '.catalog-page h1:has-text("My list")');
		await page.locator('.genre-menu > summary').click();
		await page.locator('.genre-menu').getByRole('link', { name: 'Animation', exact: true }).click();
		await expectSettledRoute('/genres/animation', '.catalog-page h1:text-is("Animation")');
		await page.getByRole('searchbox', { name: 'Search films' }).fill('Sintel');
		await page.getByRole('searchbox', { name: 'Search films' }).press('Enter');
		await expectSettledRoute(
			'/search?q=Sintel',
			'.catalog-page h1:text-is("Results for “Sintel”")'
		);
		await page.goBack();
		await expectSettledRoute('/genres/animation', '.catalog-page h1:text-is("Animation")');
		await expect(page.locator('#frame-content')).toHaveCSS('opacity', '1');
		await expect(page.locator('.preview-controls')).toHaveAttribute('data-original-frame', 'true');
		await expect(page.locator('.frame-app')).toHaveAttribute('data-original-frame', 'true');
		if (reducedMotion === 'reduce') {
			await expect(page.locator('html')).not.toHaveAttribute('data-video-fades');
		} else {
			await expect(page.locator('html')).toHaveAttribute('data-video-fades', '14');
		}
	});
}

test('a second video navigation cannot leave content faded or stale', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto(base);
	await expect(page.locator('[data-template="video-library"]')).toHaveAttribute(
		'data-ready',
		'true'
	);
	await page.getByRole('link', { name: 'More info' }).click();
	await page
		.getByRole('navigation', { name: 'Frame navigation' })
		.getByRole('link', { name: /My list/ })
		.click();
	await expect(page).toHaveURL(`${base}/my-list`);
	await expect(page.getByRole('heading', { name: /^My list/ })).toBeVisible();
	await expect(page.locator('#frame-content')).toHaveCSS('opacity', '1');
	await page.goBack();
	await expect(page.locator('#frame-content')).toHaveCSS('opacity', '1');
	await expect(page.locator('.preview-controls')).toHaveCount(1);
});
