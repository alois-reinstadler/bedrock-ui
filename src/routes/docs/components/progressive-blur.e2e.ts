import { expect, test } from '../../../../scripts/shared-browser-test';

for (const colorScheme of ['light', 'dark'] as const) {
	for (const width of [390, 1280]) {
		test(`progressive scroll edges: ${colorScheme}, ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/docs/components/scroll-area');
			const examples = page.locator('[data-blur-examples]');
			await expect(examples).toBeVisible();
			const both = examples.locator('[data-edge-blur="both"]');
			await expect(both).toHaveAttribute('data-scroll-bottom-hidden', 'true');
			await expect(both).toHaveAttribute('data-scroll-right-hidden', 'true');
			await expect(both).toHaveAttribute('data-scroll-top-hidden', 'false');
			await both
				.locator('[data-slot="scroll-area-viewport"]')
				.evaluate((node) => node.scrollTo(70, 50));
			await expect(both).toHaveAttribute('data-scroll-top-hidden', 'true');
			await expect(both).toHaveAttribute('data-scroll-left-hidden', 'true');
			for (const side of ['top', 'bottom', 'left', 'right']) {
				const edge = both.locator(`[data-scroll-edge="${side}"]`);
				await expect(edge).toHaveCSS('opacity', '1');
				await expect(edge.locator('[data-blur-layer]').first()).toHaveCSS('opacity', '1');
				await expect(edge).toHaveCSS('pointer-events', 'none');
				await expect(edge.locator('[data-blur-layer]')).toHaveCount(5);
			}
			await both
				.locator('[data-slot="scroll-area-viewport"]')
				.evaluate((node) => node.scrollTo(node.scrollWidth, node.scrollHeight));
			await expect(both).toHaveAttribute('data-scroll-bottom-hidden', 'false');
			await expect(both).toHaveAttribute('data-scroll-right-hidden', 'false');
			const activity = examples.getByRole('button', { name: 'Invoice #1048 was approved' });
			await activity.focus();
			await expect(activity).toBeFocused();
			await expect(
				examples
					.locator('[data-edge-blur="vertical"]')
					.first()
					.locator('[data-scroll-edge="bottom"] [data-blur-layer]')
					.first()
			).toHaveCSS('opacity', '0');
			await activity.press('Enter');
			await expect(activity).toHaveAttribute('aria-pressed', 'true');
			await page.emulateMedia({ forcedColors: 'active' });
			await expect(both.locator('[data-scroll-edge="top"]')).toHaveCSS('display', 'none');
		});
	}
}

test('standalone blur immediately clears for keyboard focus within its surface', async ({
	page
}) => {
	await page.goto('/docs/components/progressive-blur');
	const button = page.getByRole('button', { name: 'Inspect samples' });
	await expect(button).toBeVisible();
	const blur = button.locator('..').locator('[data-slot="progressive-blur"]');
	await expect(blur).toHaveCSS('opacity', '1');
	await button.focus();
	await expect(button).toBeFocused();
	await expect(blur).toHaveCSS('opacity', '1');
	await expect(blur.locator('[data-blur-layer]').first()).toHaveCSS('opacity', '0');
	await expect(blur.locator('[data-blur-layer]').first()).toHaveCSS('transition-duration', '0s');
	await expect(blur).toHaveCSS('pointer-events', 'none');
});

for (const contrast of ['no-preference', 'more'] as const) {
	test(`scroll blur fades its surfaces without isolating the backdrop: ${contrast}`, async ({
		page
	}) => {
		await page.emulateMedia({ reducedMotion: 'no-preference', contrast });
		await page.goto('/docs/components/scroll-area');
		const area = page.locator('[data-blur-examples] [data-edge-blur="both"]');
		await expect(area).toHaveAttribute('data-scroll-top-hidden', 'false');
		const edge = area.locator('[data-scroll-edge="top"]');
		const surface = edge.locator(
			contrast === 'more' ? '[data-blur-fallback]' : '[data-blur-layer="1"]'
		);
		await expect(surface).toHaveCSS('opacity', '0');
		const before = await edge.boundingBox();
		const midpoint = await surface.evaluate(async (node) => {
			const viewport = node
				.closest('[data-slot="scroll-area"]')
				?.querySelector('[data-slot="scroll-area-viewport"]');
			if (!viewport) throw new Error('Blur viewport missing');
			viewport.scrollTo(70, 50);
			// Capture the transition as soon as the scroll listener has updated visibility.
			let transition: Animation | undefined;
			for (let frame = 0; frame < 30 && !transition; frame++) {
				await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
				transition = node.getAnimations().find((animation) => animation instanceof CSSTransition);
			}
			// Inspect its midpoint independent of frame rate, without lengthening production timing.
			if (!transition?.effect) throw new Error('Blur surface did not start a CSS transition');
			transition.pause();
			await transition.ready;
			transition.currentTime = Number(transition.effect.getTiming().duration) / 2;
			return Number(getComputedStyle(node).opacity);
		});
		await expect(area).toHaveAttribute('data-scroll-top-hidden', 'true');
		expect(midpoint).toBeGreaterThan(0);
		expect(midpoint).toBeLessThan(1);
		await expect(edge).toHaveCSS('opacity', '1');
		expect(await edge.boundingBox()).toEqual(before);
		if (contrast === 'no-preference')
			await expect(surface).not.toHaveCSS('backdrop-filter', 'none');
		else await expect(surface).toHaveCSS('display', 'block');
		await surface.evaluate((node) =>
			node.getAnimations().forEach((animation) => animation.finish())
		);
		await expect(surface).toHaveCSS('opacity', '1');
	});
}

test('horizontal scroll edges follow direction changes and RTL endpoints', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/docs/components/scroll-area');
	const area = page.locator('[data-blur-examples] [data-edge-blur="both"]');
	await expect(area).toHaveAttribute('data-scroll-right-hidden', 'true');
	await area.evaluate((node) => node.setAttribute('dir', 'rtl'));
	await expect(area).toHaveAttribute('data-scroll-left-hidden', 'true');
	await expect(area).toHaveAttribute('data-scroll-right-hidden', 'false');
	const viewport = area.locator('[data-slot="scroll-area-viewport"]');
	await viewport.evaluate((node) => node.scrollTo(-node.scrollWidth, node.scrollHeight));
	await expect(area).toHaveAttribute('data-scroll-left-hidden', 'false');
	await expect(area).toHaveAttribute('data-scroll-right-hidden', 'true');
	await expect(area).toHaveAttribute('data-scroll-bottom-hidden', 'false');
	await expect(area).toHaveAttribute('data-scroll-top-hidden', 'true');
	await expect(area.locator('[data-scroll-edge="right"] [data-blur-layer="1"]')).toHaveCSS(
		'opacity',
		'1'
	);
	await area.evaluate((node) => node.setAttribute('dir', 'ltr'));
	await expect(area).toHaveAttribute('data-scroll-left-hidden', 'false');
	await expect(area).toHaveAttribute('data-scroll-right-hidden', 'true');
});

test('reduced transparency uses the fallback and immediately protects focused controls', async ({
	page,
	context
}) => {
	const session = await context.newCDPSession(page);
	await session.send('Emulation.setEmulatedMedia', {
		features: [
			{ name: 'prefers-reduced-transparency', value: 'reduce' },
			{ name: 'prefers-reduced-motion', value: 'reduce' }
		]
	});
	await page.goto('/docs/components/progressive-blur');
	const button = page.getByRole('button', { name: 'Inspect samples' });
	const blur = button.locator('..').locator('[data-slot="progressive-blur"]');
	const fallback = blur.locator('[data-blur-fallback]');
	await expect(fallback).toHaveCSS('display', 'block');
	await expect(fallback).toHaveCSS('opacity', '1');
	await expect(fallback).toHaveCSS('transition-duration', '0s');
	await expect(blur.locator('[data-blur-layer="1"]')).toHaveCSS('display', 'none');
	await button.focus();
	await expect(fallback).toHaveCSS('opacity', '0');
	await session.detach();
});

test('docs example cards preserve the rendered gradient of backdrop masks', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
	await page.goto('/docs/components/scroll-area');
	const area = page.locator('[data-slot="example-card"] [data-slot="scroll-area"]').first();
	await expect(area).toHaveAttribute('data-scroll-bottom-hidden', 'true');
	const edge = area.locator('[data-scroll-edge="bottom"]');
	await edge.scrollIntoViewIfNeeded();
	await area.evaluate((node) => {
		// Tint a real filtered layer to measure its mask, not just its CSS value.
		// Chromium can report the correct mask while painting an opaque rectangle
		// inside a corner-shape: superellipse() ancestor.
		const viewport = node.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		viewport.style.background = 'white';
		(viewport.firstElementChild as HTMLElement).style.visibility = 'hidden';
		const blur = node.querySelector<HTMLElement>('[data-scroll-edge="bottom"]')!;
		for (const layer of blur.querySelectorAll<HTMLElement>('span')) {
			if (layer.dataset.blurLayer === '1') layer.style.background = 'red';
			else layer.style.display = 'none';
		}
	});
	const png = await edge.screenshot();
	const samples = await page.evaluate(async (base64) => {
		const image = new Image();
		image.src = `data:image/png;base64,${base64}`;
		await image.decode();
		const canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		const context = canvas.getContext('2d')!;
		context.drawImage(image, 0, 0);
		return [0.1, 0.9].map((position) =>
			Array.from(
				context.getImageData(Math.floor(image.width / 2), Math.floor(image.height * position), 1, 1)
					.data
			)
		);
	}, png.toString('base64'));
	expect(samples[0][0]).toBeGreaterThan(240);
	expect(samples[0][1]).toBeGreaterThan(180);
	expect(samples[1][0]).toBeGreaterThan(240);
	expect(samples[1][1]).toBeLessThan(80);
});

test('scroll edges blur positioned content above the viewport background', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/docs/components/scroll-area');
	const area = page.locator('[data-blur-examples] [data-slot="scroll-area"]').first();
	await expect(area).toHaveAttribute('data-scroll-bottom-hidden', 'true');
	await area.scrollIntoViewIfNeeded();
	await area.evaluate((node) => {
		const viewport = node.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		const content = viewport.firstElementChild as HTMLElement;
		content.style.cssText =
			'height:600px; flex:none; position:relative; z-index:100; background:repeating-linear-gradient(to right,black 0 4px,white 4px 8px)';
		for (const child of content.children) (child as HTMLElement).style.visibility = 'hidden';
		viewport.scrollTop = 100;
	});
	await expect(area).toHaveAttribute('data-scroll-top-hidden', 'true');
	const png = await area.screenshot();
	const contrasts = await page.evaluate(async (base64) => {
		const image = new Image();
		image.src = `data:image/png;base64,${base64}`;
		await image.decode();
		const canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		const context = canvas.getContext('2d')!;
		context.drawImage(image, 0, 0);
		return [8, Math.floor(image.height / 2)].map((y) => {
			const pixels = context.getImageData(60, y, 160, 1).data;
			const values = Array.from({ length: 160 }, (_, x) => pixels[x * 4]);
			return Math.max(...values) - Math.min(...values);
		});
	}, png.toString('base64'));
	expect(contrasts[0]).toBeLessThan(80);
	expect(contrasts[1]).toBeGreaterThan(200);
});

test('blur paint stays inside the rounded container on every edge', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
	await page.goto('/docs/components/scroll-area');
	const area = page.locator('[data-blur-examples] [data-edge-blur="both"]');
	await area.scrollIntoViewIfNeeded();
	await area.evaluate((node) => {
		const root = node as HTMLElement;
		root.style.borderRadius = '48px';
		root.parentElement!.style.background = 'rgb(0, 128, 0)';
		const viewport = root.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		viewport.scrollTo(100, 100);
		// Tint the actual filtered surfaces so escaped paint is unambiguous.
		for (const layer of root.querySelectorAll<HTMLElement>('[data-blur-layer]')) {
			layer.style.background = 'red';
		}
	});
	await expect(area).toHaveAttribute('data-scroll-top-hidden', 'true');
	await expect(area).toHaveAttribute('data-scroll-left-hidden', 'true');
	const png = await area.screenshot();
	const pixels = await page.evaluate(async (base64) => {
		const image = new Image();
		image.src = `data:image/png;base64,${base64}`;
		await image.decode();
		const canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		const context = canvas.getContext('2d')!;
		context.drawImage(image, 0, 0);
		const sample = (x: number, y: number) => Array.from(context.getImageData(x, y, 1, 1).data);
		return {
			corners: [
				sample(4, 4),
				sample(image.width - 5, 4),
				sample(4, image.height - 5),
				sample(image.width - 5, image.height - 5)
			],
			edges: [
				sample(Math.floor(image.width / 2), 4),
				sample(Math.floor(image.width / 2), image.height - 5),
				sample(4, Math.floor(image.height / 2)),
				sample(image.width - 5, Math.floor(image.height / 2))
			]
		};
	}, png.toString('base64'));
	for (const corner of pixels.corners) expect(corner).toEqual([0, 128, 0, 255]);
	for (const edge of pixels.edges) {
		expect(edge[0]).toBeGreaterThan(240);
		expect(edge[1]).toBeLessThan(20);
	}
});

test('dark scroll blur does not brighten an empty edge into a glowing rim', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/docs/components/scroll-area');
	const area = page.locator('[data-slot="example-card"] [data-slot="scroll-area"]').first();
	await area.scrollIntoViewIfNeeded();
	await area.locator('[data-slot="scroll-area-viewport"]').evaluate((node) => {
		node.scrollTop = node.scrollHeight;
	});
	await expect(area).toHaveAttribute('data-scroll-top-hidden', 'true');
	const png = await area.screenshot();
	const brightness = await page.evaluate(async (base64) => {
		const image = new Image();
		image.src = `data:image/png;base64,${base64}`;
		await image.decode();
		const canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		const context = canvas.getContext('2d')!;
		context.drawImage(image, 0, 0);
		// The midpoint is empty background, well away from the text and corners.
		return [3, 5, 8, 10].map((y) =>
			Math.max(...context.getImageData(Math.floor(image.width / 2), y, 1, 1).data.slice(0, 3))
		);
	}, png.toString('base64'));
	for (const value of brightness) expect(value).toBeLessThan(30);
});
