import { expect, test } from '@playwright/test';

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
