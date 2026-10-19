import { expect, test } from '../../../scripts/shared-browser-test';

test('hover highlight visibly fades both in and out', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/docs');
	const navigation = page.locator('[data-docs-navigation]');
	const surface = navigation.locator('[data-hover-surface]');
	await expect(navigation.locator('[data-slot="docs-active-highlight"]')).toBeVisible();

	for (const event of ['pointerover', 'pointerleave'] as const) {
		await navigation.evaluate((root, event) => {
			const samples: { opacity: number; visibility: string }[] = [];
			Reflect.set(root, 'hoverFadeSamples', samples);
			root.addEventListener(
				event,
				() => {
					const mark = root.querySelector('[data-slot="docs-hover-highlight"]')!;
					const surface = mark.querySelector('[data-hover-surface]')!;
					const sample = () => {
						samples.push({
							opacity: Number(getComputedStyle(surface).opacity),
							visibility: getComputedStyle(mark).visibility
						});
						if (samples.length < 30) requestAnimationFrame(sample);
					};
					requestAnimationFrame(sample);
				},
				{ once: true }
			);
		}, event);
		if (event === 'pointerover')
			await navigation.getByRole('link', { name: 'Theming', exact: true }).hover();
		else await page.mouse.move(500, 100);
		await expect
			.poll(() => navigation.evaluate((root) => Reflect.get(root, 'hoverFadeSamples').length))
			.toBe(30);
		const samples = await navigation.evaluate(
			(root) => Reflect.get(root, 'hoverFadeSamples') as { opacity: number; visibility: string }[]
		);
		expect(
			samples.some(
				({ opacity, visibility }) => opacity > 0 && opacity < 1 && visibility === 'visible'
			),
			`${event} must remain painted during the fade`
		).toBe(true);
		await expect(surface).toHaveCSS('opacity', event === 'pointerover' ? '1' : '0');
	}
});

test('hover re-enters at the new item with a fade instead of travelling from the old item', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/docs');
	const navigation = page.locator('[data-docs-navigation]');
	const highlight = navigation.locator('[data-slot="docs-hover-highlight"]');
	const surface = highlight.locator('[data-hover-surface]');
	await expect(navigation.locator('[data-slot="docs-active-highlight"]')).toBeVisible();
	await navigation.getByRole('link', { name: 'Introduction', exact: true }).hover();
	await expect(surface).toHaveCSS('opacity', '1');
	const original = await highlight.elementHandle();
	await page.mouse.move(500, 100);
	await expect(highlight).toBeHidden();
	await expect(surface).toHaveCSS('opacity', '0');
	const next = navigation.getByRole('link', { name: 'Badge', exact: true });
	await next.scrollIntoViewIfNeeded();
	const target = (await next.boundingBox())!;
	const capture = navigation.evaluate(
		(root) =>
			new Promise<{ top: number; opacity: number }[]>((resolve) => {
				root.addEventListener(
					'pointerover',
					() => {
						const mark = root.querySelector('[data-slot="docs-hover-highlight"]')!;
						const surface = mark.querySelector('[data-hover-surface]')!;
						const samples: { top: number; opacity: number }[] = [];
						const sample = () => {
							samples.push({
								top: surface.getBoundingClientRect().top,
								opacity: Number(getComputedStyle(surface).opacity)
							});
							if (samples.length < 30) requestAnimationFrame(sample);
							else resolve(samples);
						};
						requestAnimationFrame(sample);
					},
					{ once: true }
				);
			})
	);
	await next.hover();
	const samples = await capture;
	expect(samples.every((sample) => Math.abs(sample.top - target.y) <= 4)).toBe(true);
	expect(samples.some((sample) => sample.opacity > 0 && sample.opacity < 1)).toBe(true);
	await expect(surface).toHaveCSS('opacity', '1');
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
});

test('sidebar blur stays steady through pointer focus and route navigation', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/docs/components/accordion');
	const area = page.locator('[data-slot="sidebar-inner"] [data-slot="scroll-area"]');
	await area
		.locator('[data-slot="scroll-area-viewport"]')
		.evaluate((node) => node.scrollTo(0, 220));
	const surfaces = area.locator('[data-scroll-edge] [data-blur-tint]');
	await expect(surfaces).toHaveCount(2);
	for (const surface of await surfaces.all()) await expect(surface).toHaveCSS('opacity', '1');
	const original = await area.elementHandle();
	const link = area.getByRole('link', { name: 'Alert', exact: true });
	await link.hover();
	await page.mouse.down();
	await expect(link).toBeFocused();
	// Holding pointer focus catches the brief disappearance before the router
	// resets focus, even when navigation completes between browser frames.
	for (const surface of await surfaces.all()) await expect(surface).toHaveCSS('opacity', '1');
	const samples = area.evaluate(async (root) => {
		const layers = root.querySelectorAll('[data-blur-layer], [data-blur-tint]');
		const opacities: number[] = [];
		for (let frame = 0; frame < 45; frame++) {
			opacities.push(...Array.from(layers, (node) => Number(getComputedStyle(node).opacity)));
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		}
		return opacities;
	});
	await page.mouse.up();
	await expect(page).toHaveURL(/\/docs\/components\/alert$/);
	expect(Math.min(...(await samples))).toBe(1);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);

	await page.getByRole('textbox', { name: 'Search documentation' }).focus();
	await page.keyboard.press('Tab');
	for (const surface of await surfaces.all()) {
		await expect(surface).toHaveCSS('opacity', '0');
		await expect(surface).toHaveCSS('transition-duration', '0s');
	}
});

test('sidebar keeps one shared highlight through navigation, scrolling and history', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const navigation = page.locator('[data-docs-navigation]');
	const highlight = navigation.locator('[data-slot="docs-active-highlight"]');
	await expect(highlight).toHaveCount(1);
	const original = await highlight.elementHandle();
	const travel = await navigation.evaluate(async (root) => {
		const indicator = root.querySelector<HTMLElement>('[data-slot="docs-active-highlight"]')!;
		const start = indicator.getBoundingClientRect().top;
		(root.querySelector('a[href="/docs/components/alert"]') as HTMLAnchorElement).click();
		const samples: number[] = [];
		for (let i = 0; i < 90; i++) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			samples.push(indicator.getBoundingClientRect().top);
		}
		return { start, samples, connected: indicator.isConnected };
	});
	await expect(page).toHaveURL(/\/docs\/components\/alert$/);
	expect(travel.connected).toBe(true);
	const finish = travel.samples.at(-1)!;
	expect(Math.abs(finish - travel.start)).toBeGreaterThan(10);
	expect(
		travel.samples.some(
			(top) => top > Math.min(travel.start, finish) + 1 && top < Math.max(travel.start, finish) - 1
		)
	).toBe(true);
	await expect(navigation.locator('a[aria-current="page"]')).toHaveText('Alert');
	await page.goBack();
	await expect(page).toHaveURL(/\/docs\/components\/accordion$/);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await navigation.getByRole('link', { name: 'Tabs', exact: true }).click();
	await expect(page.locator('[data-doc-slug="tabs"]')).toBeVisible();
	await expect
		.poll(() =>
			navigation.evaluate((root) => {
				const active = root.querySelector('[aria-current="page"]')!.getBoundingClientRect();
				const mark = root
					.querySelector('[data-slot="docs-active-highlight"]')!
					.getBoundingClientRect();
				return Math.max(Math.abs(active.top - mark.top), Math.abs(active.width - mark.width));
			})
		)
		.toBeLessThan(1);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	expect(errors).toEqual([]);
});

test('sidebar shared highlight settles immediately for reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const navigation = page.locator('[data-docs-navigation]');
	await navigation.getByRole('link', { name: 'Alert', exact: true }).click();
	await expect(navigation.locator('[aria-current="page"]')).toHaveText('Alert');
	await expect
		.poll(() =>
			navigation.evaluate((root) => {
				const mark = root.querySelector('[data-slot="docs-active-highlight"]')!;
				return mark.getAnimations().filter((animation) => animation.playState === 'running').length;
			})
		)
		.toBe(0);
	const hover = navigation.locator('[data-slot="docs-hover-highlight"]');
	const surface = hover.locator('[data-hover-surface]');
	await navigation.getByRole('link', { name: 'Theming', exact: true }).hover();
	await expect(surface).toHaveCSS('opacity', '1');
	await expect(surface).toHaveCSS('transition-duration', '0s');
	await page.mouse.move(500, 100);
	await expect(hover).toBeHidden();
	await expect(surface).toHaveCSS('opacity', '0');
});

test('mobile sidebar closes after choosing a documentation page', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/components/accordion');
	// The SSR desktop sidebar disappears once the mobile media query has hydrated.
	await expect(page.locator('[data-slot="sidebar-container"]')).toHaveCount(0);
	await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
	const drawer = page.getByRole('dialog', { name: 'Sidebar', exact: true });
	await drawer.getByRole('link', { name: 'Alert', exact: true }).click();
	await expect(page.locator('[data-doc-slug="alert"]')).toBeVisible();
	await expect(drawer).not.toBeVisible();
	await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
	await expect(drawer.locator('[aria-current="page"]')).toHaveText('Alert');
	await page.keyboard.press('Escape');
	await expect(drawer).not.toBeVisible();
});

test('search clearing retains the indicator and realigns it with the selected link', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const navigation = page.locator('[data-docs-navigation]');
	const highlight = navigation.locator('[data-slot="docs-active-highlight"]');
	await expect(highlight).toBeVisible();
	const original = await highlight.elementHandle();
	const search = page.getByRole('textbox', { name: 'Search documentation' });
	await search.fill('zzmissing');
	await expect(page.getByText('No documentation found.')).toBeVisible();
	await expect(highlight).toBeHidden();
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await search.fill('');
	await expect(search).toBeFocused();
	await expect(highlight).toBeVisible();
	await expect
		.poll(() =>
			navigation.evaluate((root) => {
				const active = root.querySelector('[aria-current="page"]')!.getBoundingClientRect();
				const mark = root
					.querySelector('[data-slot="docs-active-highlight"]')!
					.getBoundingClientRect();
				return Math.abs(active.top - mark.top);
			})
		)
		.toBeLessThan(1);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
});

test('breadcrumb, catalogue, and primary links preserve the docs document and sidebar scroll', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const original = await page.locator('[data-docs-navigation]').elementHandle();
	const viewport = page.locator('[data-slot="sidebar-inner"] [data-slot="scroll-area-viewport"]');
	await viewport.evaluate((node) => {
		node.scrollTop = 300;
	});
	const scrollTop = await viewport.evaluate((node) => node.scrollTop);
	await page
		.getByRole('navigation', { name: 'breadcrumb' })
		.getByRole('link', { name: 'Components', exact: true })
		.click();
	await expect(page).toHaveURL(/\/docs\/components$/);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	expect(await viewport.evaluate((node) => node.scrollTop)).toBe(scrollTop);
	const card = page.locator('main a[href="/docs/components/accordion"]');
	await card.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('[data-doc-slug="accordion"]')).toBeVisible();
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await page
		.getByRole('navigation', { name: 'Primary' })
		.getByRole('link', { name: 'Blocks', exact: true })
		.click();
	await expect(page).toHaveURL(/\/docs\/blocks$/);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await page.goBack();
	await expect(page.locator('[data-doc-slug="accordion"]')).toBeVisible();
	await page.goForward();
	await expect(page).toHaveURL(/\/docs\/blocks$/);
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	expect(errors).toEqual([]);
});

for (const overlay of [
	{ slug: 'dialog', trigger: 'Open dialog', selector: '[data-slot="dialog-content"]' },
	{ slug: 'popover', trigger: 'Column widths', selector: '[data-slot="popover-content"]' }
]) {
	test(`history navigation tears down an open ${overlay.slug} without trapping focus`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto('/docs/components/accordion');
		const original = await page.locator('[data-docs-navigation]').elementHandle();
		await page
			.locator('[data-docs-navigation]')
			.locator(`a[href="/docs/components/${overlay.slug}"]`)
			.click();
		await page
			.locator('#preview')
			.getByRole('button', { name: overlay.trigger, exact: true })
			.click();
		await expect(page.locator(overlay.selector)).toBeVisible();
		await page.goBack();
		await expect(page.locator('[data-doc-slug="accordion"]')).toBeVisible();
		await expect(page.locator(overlay.selector)).toHaveCount(0);
		expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
		const search = page.getByRole('textbox', { name: 'Search documentation' });
		await search.focus();
		await expect(search).toBeFocused();
		await search.fill('alert');
		await page.locator('[data-docs-navigation] a[href="/docs/components/alert"]').click();
		await expect(page.locator('[data-doc-slug="alert"]')).toBeVisible();
		expect(errors).toEqual([]);
	});
}

test('block reference exits to the catalogue without reading another route data shape', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/blocks/authentication-panel');
	// Wait for hydration before asserting client-side document continuity.
	await expect(page.locator('[data-slot="docs-active-highlight"]')).toBeVisible();
	const original = await page.locator('[data-docs-navigation]').elementHandle();
	await expect(page.locator('[data-doc-slug="authentication-panel"]')).toBeVisible();
	await page
		.getByRole('navigation', { name: 'breadcrumb' })
		.getByRole('link', { name: 'Blocks', exact: true })
		.click();
	await expect(page).toHaveURL(/\/docs\/blocks$/);
	await expect(
		page.locator('main').getByRole('heading', { name: 'Blocks', exact: true })
	).toBeVisible();
	expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
	await page.goBack();
	await expect(page.locator('[data-doc-slug="authentication-panel"]')).toBeVisible();
	expect(errors).toEqual([]);
});

for (const mode of ['visible', 'offscreen', 'reduced'] as const) {
	test(`active sidebar highlight uses ${mode === 'visible' ? 'shared movement' : mode === 'offscreen' ? 'local fade and slide' : 'immediate selection'} from a ${mode === 'visible' ? 'visible' : 'clipped'} source`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.emulateMedia({ reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
		await page.goto(`/docs/components/${mode === 'visible' ? 'accordion' : 'tabs'}`);
		const navigation = page.locator('[data-docs-navigation]');
		await expect
			.poll(() =>
				navigation
					.locator('[data-slot="docs-active-highlight"]')
					.evaluate((mark) => (mark as HTMLElement).style.width)
			)
			.not.toBe('');
		const samples = await navigation.evaluate(async (root) => {
			const mark = root.querySelector<HTMLElement>('[data-slot="docs-active-highlight"]')!;
			const source = root.querySelector<HTMLElement>('[aria-current="page"]')!;
			const target = root.querySelector<HTMLAnchorElement>('a[href="/docs/components/alert"]')!;
			const viewport = root.closest('[data-slot="scroll-area-viewport"]')!.getBoundingClientRect();
			const sourceBox = source.getBoundingClientRect();
			const sourceVisible = sourceBox.bottom > viewport.top && sourceBox.top < viewport.bottom;
			const positions: { y: number; opacity: number; offset: number }[] = [];
			target.click();
			const deadline = performance.now() + 5000;
			let selectedAt = 0;
			do {
				await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
				if (target.getAttribute('aria-current') !== 'page') continue;
				selectedAt ||= performance.now();
				positions.push({
					y: mark.getBoundingClientRect().y,
					opacity: Number(getComputedStyle(mark).opacity),
					offset: mark.getBoundingClientRect().y - target.getBoundingClientRect().y
				});
			} while (
				performance.now() < deadline &&
				(!selectedAt || performance.now() - selectedAt < 650)
			);
			return { sourceVisible, positions, connected: mark.isConnected };
		});
		expect(samples.sourceVisible).toBe(mode === 'visible');
		expect(samples.connected).toBe(true);
		expect(samples.positions.length).toBeGreaterThan(0);
		expect(Math.abs(samples.positions.at(-1)!.offset)).toBeLessThan(1);
		if (mode === 'visible') {
			expect(samples.positions.some(({ offset }) => offset < -4 && offset > -32)).toBe(true);
			expect(samples.positions.every(({ opacity }) => opacity === 1)).toBe(true);
		} else {
			expect(samples.positions.every(({ offset }) => Math.abs(offset) <= 3.1)).toBe(true);
			if (mode === 'offscreen') {
				expect(samples.positions.some(({ opacity }) => opacity > 0 && opacity < 1)).toBe(true);
				expect(samples.positions.some(({ offset }) => offset > 0.1)).toBe(true);
			} else {
				expect(
					samples.positions.every(({ opacity, offset }) => opacity === 1 && Math.abs(offset) < 1)
				).toBe(true);
			}
		}
	});
}
