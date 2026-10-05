import { test, expect } from '../../../scripts/shared-browser-test';

const additions = [
	'color-area',
	'color-field',
	'color-slider',
	'color-swatch',
	'color-swatch-picker',
	'phone-input',
	'qr-code',
	'marquee',
	'animated-signature',
	'spotlight',
	'tilt-card',
	'text-shimmer',
	'text-highlight',
	'animated-gradient',
	'light-rays',
	'dot-pattern',
	'grid-pattern',
	'noise-overlay'
];

test('new component documentation loads examples and usable API references', async ({ page }) => {
	test.setTimeout(180000);
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	for (const slug of additions) {
		await page.goto(`/docs/components/${slug}`);
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('#preview [data-slot]').first()).toBeVisible();
		await expect(page.locator('#examples [data-slot]').first()).toBeVisible();
		await expect(page.getByText('Variants could not load.')).toHaveCount(0);
		await expect(page.getByText('Examples could not load.')).toHaveCount(0);
	}
	expect(errors).toEqual([]);
});

test('shader requirements and fallback stay useful without WebGL2', async ({ page }) => {
	test.setTimeout(60000);
	await page.addInitScript(() => {
		const original = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function (
			this: HTMLCanvasElement,
			...args: Parameters<typeof original>
		) {
			if (args[0] === 'webgl2') return null;
			return original.apply(this, args);
		} as typeof original;
	});
	for (const slug of ['animated-gradient', 'light-rays']) {
		await page.goto(`/docs/components/${slug}`);
		await expect(page.getByText('WebGL2 required', { exact: true })).toBeVisible();
		const slot = slug === 'animated-gradient' ? 'shader-background' : 'light-rays';
		const surface = page.locator(`#preview [data-slot="${slot}"]`);
		await expect(
			surface.getByText(slug === 'animated-gradient' ? 'Room to imagine.' : 'Beautiful')
		).toBeVisible({ timeout: 20000 });
		await expect(surface.locator('[data-renderer]')).toHaveAttribute('data-renderer', 'fallback');
		await expect(surface.locator('canvas')).toHaveCount(0);
		await expect(surface.locator('[aria-hidden="true"]')).toHaveCSS('pointer-events', 'none');
	}
});

test('new examples fit a phone viewport', async ({ page }) => {
	test.setTimeout(90000);
	await page.setViewportSize({ width: 390, height: 844 });
	for (const slug of [
		'phone-input',
		'color-picker',
		'spotlight',
		'qr-code',
		'marquee',
		'animated-gradient'
	]) {
		await page.goto(`/docs/components/${slug}`);
		await expect(page.locator('#preview [data-slot]').first()).toBeVisible();
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
			slug
		).toBe(true);
	}
});
