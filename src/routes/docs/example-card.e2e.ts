import { expect, test } from '../../../scripts/shared-browser-test';

for (const width of [1440, 390]) {
	test(`documentation panels size naturally and bound overflow at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/docs/components/input');
		const preview = page
			.locator('#preview')
			.getByRole('tabpanel', { name: 'Preview', exact: true });
		await expect(preview.getByRole('textbox', { name: 'Site name' })).toBeVisible();
		const bounds = await preview.evaluate((element) => {
			const style = getComputedStyle(element);
			return {
				height: element.getBoundingClientRect().height,
				min: parseFloat(style.minHeight),
				max: parseFloat(style.maxHeight)
			};
		});
		expect(bounds.height).toBeGreaterThanOrEqual(bounds.min);
		expect(bounds.height).toBeLessThanOrEqual(bounds.max);
		expect(bounds.height).toBeLessThan(384); // The former fixed preview height.
		await page.goto('/docs/components/data-table');
		const card = page.locator('#examples [data-slot="example-card"]').first();
		await card.getByRole('tab', { name: 'Code', exact: true }).click();
		const code = card.getByRole('tabpanel', { name: 'Code', exact: true });
		await expect(code.locator('pre')).toBeVisible();
		const sizing = await code.evaluate((element) => ({
			height: element.getBoundingClientRect().height,
			max: parseFloat(getComputedStyle(element).maxHeight),
			scrollHeight: element.scrollHeight,
			overflow: getComputedStyle(element).overflowY
		}));
		expect(sizing.height).toBeLessThanOrEqual(sizing.max);
		expect(sizing.scrollHeight).toBeGreaterThan(sizing.height);
		expect(sizing.overflow).toBe('auto');
		await code.evaluate((element) => {
			element.scrollTop = element.scrollHeight;
		});
		expect(await code.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}
