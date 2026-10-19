import { expect, test } from '../../../scripts/shared-browser-test';
import { components } from './registry';

for (const component of components) {
	test(`${component.slug} mounts its lazy preview and example in both layouts`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
		await page.setViewportSize({ width: 1440, height: 900 });
		const response = await page.goto(`/docs/components/${component.slug}`);
		expect(response?.status()).toBe(200);
		await expect(page.locator('h1')).toHaveText(component.title);
		await expect(page.getByText('Loading variants…', { exact: true })).toHaveCount(0);
		await expect(page.locator('[aria-label="Loading example"]')).toHaveCount(0);
		await expect(page.getByText(/Variants could not load|Example could not load/)).toHaveCount(0);
		await expect
			.poll(() =>
				page
					.locator('#preview .example-panel')
					.first()
					.evaluate((node) => node.childElementCount)
			)
			.toBeGreaterThan(0);
		await expect(page.locator('#examples')).toBeVisible();
		await page.setViewportSize({ width: 390, height: 900 });
		await page.evaluate(() => document.documentElement.classList.add('dark'));
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
			.toBeLessThanOrEqual(1);
		expect(errors).toEqual([]);
	});
}
