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
					.locator('[data-scroll-edge="bottom"]')
			).toHaveCSS('opacity', '0');
			await activity.press('Enter');
			await expect(activity).toHaveAttribute('aria-pressed', 'true');
			await page.emulateMedia({ forcedColors: 'active' });
			await expect(both.locator('[data-scroll-edge="top"]')).toHaveCSS('display', 'none');
		});
	}
}
