import { expect, test } from '../../../scripts/shared-browser-test';

test('image demo keeps a visible loading state on every replay without network throttling', async ({
	page
}) => {
	await page.goto('/docs/components/image');
	const frame = page.locator('#examples [data-slot="image"]');
	await frame.scrollIntoViewIfNeeded();
	await expect(frame).toHaveAttribute('data-state', 'loaded');
	for (let replay = 0; replay < 2; replay++) {
		await frame.evaluate((frame) => {
			let started = 0;
			const observer = new MutationObserver(() => {
				if (frame.getAttribute('data-state') === 'loading') started = performance.now();
				if (started && frame.getAttribute('data-state') === 'loaded') {
					observer.disconnect();
					Reflect.set(frame, 'loadingDuration', performance.now() - started);
				}
			});
			observer.observe(frame, { attributes: true, attributeFilter: ['data-state'] });
		});
		await page.getByRole('button', { name: 'Reload image' }).click();
		await expect(frame.locator('[data-slot="skeleton"]')).toBeVisible();
		await expect
			.poll(() =>
				frame
					.locator('img')
					.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)
			)
			.toBe(true);
		await expect(frame).toHaveAttribute('data-state', 'loading');
		await expect(frame).toHaveAttribute('data-state', 'loaded');
		expect(
			await frame.evaluate((frame) => Reflect.get(frame, 'loadingDuration'))
		).toBeGreaterThanOrEqual(1100);
		await expect(frame.locator('img')).toHaveCSS('opacity', '1');
	}
});

test('image skeleton reserves space through a slow request and a source change', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	let release!: () => void;
	let pending = new Promise<void>((resolve) => (release = resolve));
	await page.route('**/demo/landscape.svg*', async (route) => {
		await pending;
		await route.continue();
	});
	await page.goto('/docs/components/image', { waitUntil: 'domcontentloaded' });
	const frame = page.locator('#preview [data-slot="image"]').first();
	await expect(frame).toHaveAttribute('data-state', 'loading');
	await expect(frame.locator('[data-slot="skeleton"]')).toBeVisible();
	const before = (await frame.boundingBox())!;
	expect(before.height).toBeGreaterThan(100);
	expect(before.width / before.height).toBeCloseTo(16 / 9, 1);
	release();
	await expect(frame).toHaveAttribute('data-state', 'loaded');
	await expect(frame.locator('img')).toHaveCSS('opacity', '1');
	expect(await frame.boundingBox()).toEqual(before);
	await expect(frame.locator('[data-slot="skeleton"]')).toHaveCount(0);

	const example = page.locator('#examples [data-slot="image"]');
	await example.scrollIntoViewIfNeeded();
	await expect(example).toHaveAttribute('data-state', 'loaded');
	const original = (await example.boundingBox())!;
	pending = new Promise<void>((resolve) => (release = resolve));
	await page.getByRole('button', { name: 'Reload image' }).click();
	await expect(example).toHaveAttribute('data-state', 'loading');
	await expect(example.locator('img')).toHaveCSS('opacity', '0');
	release();
	await expect(example).toHaveAttribute('data-state', 'loaded');
	const reloaded = (await example.boundingBox())!;
	expect(reloaded.width).toBe(original.width);
	expect(reloaded.height).toBe(original.height);
	expect(errors).toEqual([]);
});

test('failed images retain their alternative and can be reloaded successfully', async ({
	page
}) => {
	await page.route('**/demo/landscape.svg*', (route) =>
		route.fulfill({ status: 200, contentType: 'image/png', body: 'invalid image' })
	);
	await page.goto('/docs/components/image');
	const example = page.locator('#examples [data-slot="image"]');
	await example.scrollIntoViewIfNeeded();
	await expect(example).toHaveAttribute('data-state', 'error');
	await expect(example.getByRole('img')).toHaveAccessibleName(
		'Layered green mountains and a pale sun in a muted sky'
	);
	await expect(example.getByText('Image unavailable')).toBeVisible();
	await expect(example.locator('[data-slot="skeleton"]')).toHaveCount(0);
	await page.unroute('**/demo/landscape.svg*');
	await page.getByRole('button', { name: 'Reload image' }).click();
	await expect(example).toHaveAttribute('data-state', 'loaded');
	await expect(example.getByRole('img')).toHaveAccessibleName(
		'Layered green mountains and a pale sun in a muted sky'
	);
});

test('reduced motion keeps a static skeleton while disabling the image fade', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	let release!: () => void;
	const pending = new Promise<void>((resolve) => (release = resolve));
	await page.route('**/demo/landscape.svg*', async (route) => {
		await pending;
		await route.continue();
	});
	await page.goto('/docs/components/image', { waitUntil: 'domcontentloaded' });
	const frame = page.locator('#preview [data-slot="image"]').first();
	await expect(frame.locator('[data-slot="skeleton"]')).toHaveCSS('animation-name', 'none');
	await expect(frame.locator('[data-slot="skeleton"]')).toHaveAttribute('data-variant', 'static');
	await expect(frame.locator('img')).toHaveCSS('transition-duration', '0s');
	release();
	await expect(frame).toHaveAttribute('data-state', 'loaded');
});
