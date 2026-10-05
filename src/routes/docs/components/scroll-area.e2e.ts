import { expect, test } from '../../../../scripts/shared-browser-test';

test('horizontal examples map the mouse wheel, release at the end, and can opt out', async ({
	page
}) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/docs/components/scroll-area');
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	const root = page.locator('[data-slot="example-card"] [data-edge-blur="horizontal"]').first();
	const viewport = root.locator('[data-slot="scroll-area-viewport"]');
	await expect(root).toHaveAttribute('data-scroll-right-hidden', 'true');
	await viewport.hover();
	const before = await page.evaluate(() => window.scrollY);
	await page.mouse.wheel(0, 120);
	await expect.poll(() => viewport.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
	await expect(root).toHaveAttribute('data-scroll-left-hidden', 'true');
	expect(await page.evaluate(() => window.scrollY)).toBe(before);
	await viewport.evaluate((node) => node.scrollTo(node.scrollWidth, 0));
	await expect(root).toHaveAttribute('data-scroll-right-hidden', 'false');
	await page.mouse.wheel(0, 150);
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);

	await page.getByRole('switch', { name: 'Mouse wheel scrolls horizontal panels' }).first().click();
	await viewport.evaluate((node) => node.scrollTo(0, 0));
	await viewport.hover();
	const offBefore = await page.evaluate(() => window.scrollY);
	await page.mouse.wheel(0, 120);
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(offBefore);
	expect(await viewport.evaluate((node) => node.scrollLeft)).toBe(0);
	expect(errors).toEqual([]);
});

test('real wheel ticks animate through intermediate positions', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/docs/components/scroll-area');
	const root = page.locator('[data-slot="example-card"] [data-edge-blur="horizontal"]').first();
	const viewport = root.locator('[data-slot="scroll-area-viewport"]');
	await expect(root).toHaveAttribute('data-scroll-right-hidden', 'true');
	await viewport.hover();
	await viewport.evaluate((node) => {
		node.addEventListener(
			'wheel',
			() => {
				const samples = [node.scrollLeft];
				const start = performance.now();
				const sample = () => {
					samples.push(node.scrollLeft);
					if (performance.now() - start < 700) requestAnimationFrame(sample);
					else node.setAttribute('data-wheel-samples', JSON.stringify(samples));
				};
				requestAnimationFrame(sample);
			},
			{ once: true }
		);
	});
	await page.mouse.wheel(0, 120);
	await expect(viewport).toHaveAttribute('data-wheel-samples', /\[/);
	const samples: number[] = JSON.parse((await viewport.getAttribute('data-wheel-samples'))!);
	expect(samples[0]).toBe(0);
	expect(samples.filter((x) => x > 0 && x < 120).length).toBeGreaterThan(2);
	expect(samples.at(-1)).toBe(120);
	expect(samples).toEqual([...samples].sort((a, b) => a - b));
});
