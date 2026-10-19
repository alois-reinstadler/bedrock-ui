import { expect, test, type Locator } from '../../../scripts/shared-browser-test';

const templates = ['email-client', 'music-player', 'social-network', 'video-library'] as const;

async function geometry(locator: Locator) {
	return locator.evaluate((element) => {
		const style = getComputedStyle(element);
		return {
			radius: style.borderTopLeftRadius,
			corner: style.getPropertyValue('corner-shape')
		};
	});
}

// Convert modern CSS colors (including oklch tokens) through the browser's sRGB canvas,
// then composite transparent ancestors. These targets contain text over flat surfaces.
async function textContrast(locator: Locator) {
	return locator.evaluate((element) => {
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 1;
		const context = canvas.getContext('2d', { willReadFrequently: true })!;
		const rgba = (color: string) => {
			context.clearRect(0, 0, 1, 1);
			context.fillStyle = color;
			context.fillRect(0, 0, 1, 1);
			return [...context.getImageData(0, 0, 1, 1).data];
		};
		const ancestors: Element[] = [];
		for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement)
			ancestors.unshift(ancestor);
		let background = [255, 255, 255];
		for (const ancestor of ancestors) {
			const color = rgba(getComputedStyle(ancestor).backgroundColor);
			const alpha = color[3] / 255;
			background = background.map((channel, i) => color[i] * alpha + channel * (1 - alpha));
		}
		const style = getComputedStyle(element);
		const foreground = rgba(style.color);
		const luminance = (color: number[]) =>
			color.slice(0, 3).reduce((sum, channel, i) => {
				const normalized = channel / 255;
				const linear =
					normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
				return sum + linear * [0.2126, 0.7152, 0.0722][i];
			}, 0);
		const foregroundLuminance = luminance(foreground);
		const backgroundLuminance = luminance(background);
		return {
			text: element.textContent?.trim(),
			foreground: foreground.slice(0, 3),
			background,
			opacity: style.opacity,
			contrast:
				(Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
				(Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
		};
	});
}

for (const width of [390, 1440]) {
	for (const colorScheme of ['light', 'dark'] as const) {
		for (const slug of templates) {
			test(`${slug} preserves template consistency at ${width}px in ${colorScheme}`, async ({
				page
			}, testInfo) => {
				await page.setViewportSize({ width, height: 900 });
				await page.emulateMedia({ colorScheme });
				const pageErrors: string[] = [];
				const consoleErrors: string[] = [];
				const failedRequests: { url: string; error: string | null }[] = [];
				page.on('pageerror', (error) => pageErrors.push(error.message));
				page.on('console', (message) => {
					if (message.type() === 'error') consoleErrors.push(message.text());
				});
				page.on('requestfailed', (request) =>
					failedRequests.push({ url: request.url(), error: request.failure()?.errorText ?? null })
				);
				const evidence: Record<string, unknown> = { slug, width, colorScheme };
				try {
					await page.goto(`/templates/${slug}`);
					const controls = page.getByRole('region', { name: 'Template preview controls' });
					await expect(controls).toHaveAttribute('data-ready', 'true');
					await expect
						.poll(() => page.locator('html').evaluate((node) => node.classList.contains('dark')))
						.toBe(colorScheme === 'dark');
					await page.evaluate(() => document.fonts.ready);
					await expect
						.poll(() =>
							page.evaluate(
								() => document.documentElement.scrollWidth - document.documentElement.clientWidth
							)
						)
						.toBeLessThanOrEqual(1);
					const toggle = controls.getByRole('button', { name: 'Toggle color mode' });
					const initial = await geometry(controls);
					expect(initial.corner).toBe((await geometry(toggle)).corner);
					evidence.initialControls = initial;
					await testInfo.attach(`${slug}-${width}-${colorScheme}`, {
						body: await page.screenshot(),
						contentType: 'image/png'
					});

					// Mutate the real public theme tokens at runtime: a static class match is
					// insufficient to catch custom surfaces that only happen to look similar.
					await page.evaluate(() => {
						document.documentElement.style.setProperty('--corner-shape', 'bevel');
						document.documentElement.style.setProperty('--radius', '1.5rem');
					});
					// Button's transition-all interpolates corner-shape; sample the settled state.
					await expect(toggle).toHaveCSS('corner-shape', /^(bevel|superellipse\(0\))$/);
					await expect(controls).toHaveCSS('corner-shape', /^(bevel|superellipse\(0\))$/);
					const changed = await geometry(controls);
					const themedCorner = (await geometry(toggle)).corner;
					expect(themedCorner).toMatch(/^(bevel|superellipse\(0\))$/);
					expect(changed.corner).toBe(themedCorner);
					expect(parseFloat(changed.radius)).toBeCloseTo(33.6, 1);
					evidence.overriddenControls = changed;

					if (slug === 'email-client' || slug === 'music-player') {
						const navigation = page.locator(
							slug === 'email-client' ? '.app-navigation a' : '.sidebar nav a'
						);
						expect(await navigation.count()).toBeGreaterThan(1);
						const samples = [];
						for (const link of await navigation.all()) {
							const sample = await geometry(link);
							expect(sample.corner).toBe(themedCorner);
							expect(parseFloat(sample.radius)).toBeCloseTo(24, 1);
							samples.push(sample);
						}
						evidence.navigation = samples;
					}

					if (slug === 'social-network') {
						// Social navigation and posting controls intentionally share round pills.
						const pills = page.locator(
							width === 390 ? '.mobile-nav a, .primary-button' : '.desktop-nav > a, .primary-button'
						);
						expect(await pills.count()).toBeGreaterThan(1);
						const samples = [];
						for (const pill of await pills.all()) {
							const sample = await geometry(pill);
							expect(sample.corner).toMatch(/^(round|superellipse\(1\))$/);
							expect(parseFloat(sample.radius)).toBeGreaterThanOrEqual(9999);
							samples.push(sample);
						}
						evidence.pills = samples;
					}

					if (slug === 'music-player') {
						const artwork = page.locator('.playing > a');
						await expect(artwork).toHaveAccessibleName(/^Open .+ collection$/);
						await expect(artwork).toHaveAttribute(
							'href',
							/\/templates\/music-player\/album\/[^/]+$/
						);
						evidence.artworkName = await artwork.getAttribute('aria-label');
						expect((await geometry(page.locator('.play-button').first())).corner).toMatch(
							/^(round|superellipse\(1\))$/
						);
					}

					if (slug === 'video-library') {
						const initials = await textContrast(page.locator('.account-initials'));
						const footer = await textContrast(page.locator('.frame-footer > span'));
						expect(initials.contrast).toBeGreaterThanOrEqual(4.5);
						expect(footer.contrast).toBeGreaterThanOrEqual(4.5);
						evidence.contrast = { initials, footer };
						await expect(page.locator('.frame-app')).toHaveCSS('color-scheme', 'dark');
						await page.getByRole('button', { name: 'Your account' }).click();
						const menu = page.getByRole('menu');
						await expect(menu).toBeVisible();
						await expect(menu).toHaveCSS('background-color', 'rgb(36, 36, 38)');
						await expect(menu).toHaveCSS('color', 'rgb(246, 245, 242)');
						expect((await geometry(menu)).corner).toBe(themedCorner);
						const bounds = await menu.boundingBox();
						expect(bounds).not.toBeNull();
						expect(bounds!.x).toBeGreaterThanOrEqual(0);
						expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
						evidence.menu = { ...(await geometry(menu)), bounds };
						await testInfo.attach('video-themed-menu', {
							body: await page.screenshot(),
							contentType: 'image/png'
						});
						await page.keyboard.press('Escape');
						await expect(menu).toHaveCount(0);
						await expect(page.getByRole('button', { name: 'Your account' })).toBeFocused();
					}

					if (slug === 'email-client') {
						await page.goto('/templates/email-client/calendar');
						await expect(controls).toHaveAttribute('data-ready', 'true');
						const outside = page.locator('.month-day.outside:not(.today)').first();
						await expect(outside).toBeEnabled();
						const date = outside.locator('.day-number');
						await expect(date).toHaveCSS('opacity', '1');
						const contrast = await textContrast(date);
						expect(contrast.contrast).toBeGreaterThanOrEqual(4.5);
						evidence.outsideDate = contrast;
						await testInfo.attach('calendar-outside-date', {
							body: await page.screenshot(),
							contentType: 'image/png'
						});
					}
					expect(pageErrors).toEqual([]);
					expect(
						consoleErrors.filter((message) => /Unexpected value for (reload|preload)/.test(message))
					).toEqual([]);
				} finally {
					await testInfo.attach('computed-styles-and-diagnostics', {
						body: JSON.stringify(
							{ ...evidence, pageErrors, consoleErrors, failedRequests },
							null,
							2
						),
						contentType: 'application/json'
					});
				}
			});
		}
	}
}
