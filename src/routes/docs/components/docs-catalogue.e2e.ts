import { expect, test } from '@playwright/test';
import { components } from '../../../lib/site/registry';

for (const component of components) {
	test(`${component.slug}: common variants and contextual example load`, async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		const response = await page.goto(`/docs/components/${component.slug}`);
		expect(response?.status()).toBe(200);
		await expect(page.locator('[data-doc-slug]')).toHaveAttribute('data-doc-slug', component.slug);
		await expect(page.locator('#preview')).toContainText('Common variants');
		await expect(page.locator('#preview')).not.toContainText('Loading variants');
		await expect(page.locator('#preview')).not.toContainText('could not load');
		await expect(page.locator('[aria-label="Loading example"]')).toHaveCount(0);
		await expect(page.locator('#examples')).not.toContainText('Example failed to load');
		await expect(page.locator('#examples')).not.toContainText('Example in review');
		await expect(page.locator('#installation .shiki')).toBeVisible();
		expect(
			await page.evaluate(() => {
				const ids = [...document.querySelectorAll('[id]')].map((node) => node.id).filter(Boolean);
				return ids.filter((id, index) => ids.indexOf(id) !== index);
			})
		).toEqual([]);
		expect(errors).toEqual([]);
	});
}
