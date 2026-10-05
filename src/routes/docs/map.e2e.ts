import { test, expect } from '../../../scripts/shared-browser-test';
import { mapExamples } from '../../lib/site/map-examples/catalog';

test('map gallery loads every example and exposes copyable Bedrock source', async ({ page }) => {
	test.setTimeout(120_000);
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/map');
	const gallery = page.locator('[data-map-gallery]');
	await expect(gallery.getByLabel('Map example')).toBeVisible({ timeout: 30_000 });
	await expect(gallery.locator('optgroup')).toHaveCount(9);
	for (const example of mapExamples) {
		await gallery.getByLabel('Map example').selectOption(example.file);
		const demo = gallery.locator(`[data-map-example="${example.file}"]`);
		if (example.file === 'LazyMapExample')
			await demo.getByRole('button', { name: 'Load map' }).click();
		await expect(demo.locator('[data-slot="map"]')).toBeVisible({ timeout: 30_000 });
		await gallery.getByRole('tab', { name: 'Code', exact: true }).click();
		await expect(gallery.getByRole('tabpanel')).toContainText('#lib/bedrock/ui/map');
		await gallery.getByRole('tab', { name: 'Preview', exact: true }).click();
	}
	expect(errors).toEqual([]);
});

test('map reports unsupported graphics without breaking the documentation', async ({ page }) => {
	await page.addInitScript(() => {
		const original = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function (
			this: HTMLCanvasElement,
			type: string,
			...args: unknown[]
		) {
			if (type === 'webgl2') return null;
			return Reflect.apply(original, this, [type, ...args]);
		} as typeof original;
	});
	await page.goto('/docs/components/map');
	await expect(page.locator('[data-map-unavailable]').first()).toContainText('WebGL2', {
		timeout: 30_000
	});
	await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
});

test('map controls, popup, route progress and camera interact @remote-media', async ({ page }) => {
	await page.goto('/docs/components/map');
	const supported = await page.evaluate(() => {
		const gl = document.createElement('canvas').getContext('webgl2');
		gl?.getExtension('WEBGL_lose_context')?.loseContext();
		return !!gl;
	});
	test.skip(!supported, 'The shared Chrome must provide WebGL2 to verify actual map rendering.');
	await page.getByRole('button', { name: 'Show Vienna', exact: true }).click();
	await expect(page.locator('.maplibregl-popup')).toContainText('Vienna');
	await page.getByRole('button', { name: 'Close popup' }).click();
	const gallery = page.locator('[data-map-gallery]');
	await gallery.getByLabel('Map example').selectOption('MapControlsExample');
	await gallery.getByRole('button', { name: 'Zoom in', exact: true }).click();
	await gallery.getByRole('button', { name: 'Zoom out', exact: true }).click();
	await gallery.getByLabel('Map example').selectOption('RouteProgressExample');
	await gallery.getByRole('slider').focus();
	await page.keyboard.press('End');
	await expect(gallery).toContainText('100%');
	await gallery.getByLabel('Map example').selectOption('AdvancedUsageExample');
	await gallery.getByRole('button', { name: '3D View' }).click();
	await expect(gallery).toContainText('Pitch: 60°');
	await gallery.getByRole('button', { name: 'Reset', exact: true }).click();
	await expect(gallery).toContainText('Pitch: 0°');
});

test('map guide and location finder remain usable without a canvas', async ({ page }) => {
	await page.goto('/docs/components/map');
	await expect(page.getByRole('heading', { name: 'Create a map', exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Lazy loading', exact: true })).toBeVisible();
	const gallery = page.locator('[data-map-gallery]');
	const places = gallery.getByRole('list', { name: 'Places in Vienna' });
	const museum = places.getByRole('button', { name: /MuseumsQuartier/ });
	await museum.focus();
	await page.keyboard.press('Enter');
	await expect(museum).toHaveAttribute('aria-pressed', 'true');
	await expect(places.getByRole('button', { name: /Stephansplatz/ })).toHaveAttribute(
		'aria-pressed',
		'false'
	);
	await expect(gallery.getByRole('status').filter({ hasText: 'Selected:' })).toHaveText(
		'Selected: MuseumsQuartier'
	);
});
