import { test, expect, type Page } from '../../../scripts/shared-browser-test';

async function demo(page: Page, width = 1440) {
	await page.setViewportSize({ width, height: 1000 });
	await page.goto('/docs/tools/page-annotations');
	const sample = page.locator('[data-feedback-sample]');
	await expect(sample).toBeVisible({ timeout: 15000 });
	await sample.scrollIntoViewIfNeeded();
	await page.getByRole('button', { name: 'Review this sample' }).click();
	return sample;
}

test('compact toolbar, contextual composer, shortcuts and marker visibility work together', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	const sample = await demo(page);
	await expect(page.locator('.feedback-panel')).toHaveCount(0);
	await expect(page.locator('.feedback-toolbar')).toBeVisible();
	await page.keyboard.press('i');
	await sample.locator('h4').click();
	const composer = page.locator('.feedback-composer');
	await expect(composer).toBeVisible();
	const anchor = await sample.locator('h4').boundingBox();
	const card = await composer.boundingBox();
	expect(card!.width).toBeLessThanOrEqual(301);
	expect(
		Math.min(
			Math.abs(card!.y - anchor!.y - anchor!.height),
			Math.abs(anchor!.y - card!.y - card!.height),
			Math.abs(card!.x - anchor!.x - anchor!.width),
			Math.abs(anchor!.x - card!.x - card!.width)
		)
	).toBeLessThan(20);
	const input = page.getByRole('textbox', { name: 'What would you like to change?' });
	await expect(input).toBeFocused();
	await input.fill('Improve this heading');
	await input.press('Shift+Enter');
	await input.press('i');
	await expect(input).toHaveValue('Improve this heading\ni');
	await input.press('Enter');
	await expect(composer).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Pause selection' })).toBeVisible();
	await expect(page.locator('.feedback-pin')).toHaveCount(1);
	await page.getByRole('button', { name: 'Hide markers' }).click();
	await expect(page.locator('.feedback-pin')).toHaveCount(0);
	await page.getByRole('button', { name: 'Show markers' }).click();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
	await expect(page.getByText('Improve this heading\ni', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Edit: Improve this heading i' }).click();
	await expect(input).toHaveValue('Improve this heading\ni');
	await page.getByRole('button', { name: 'Delete note', exact: true }).click();
	await expect(page.locator('.feedback-pin')).toHaveCount(0);
	expect(errors).toEqual([]);
});

test('toolbar can be dragged and reset and its panels stay within a narrow viewport', async ({
	page
}) => {
	await demo(page, 320);
	const grip = page.getByRole('button', { name: 'Move feedback toolbar' });
	const start = await grip.boundingBox();
	await page.mouse.move(start!.x + start!.width / 2, start!.y + start!.height / 2);
	await page.mouse.down();
	await page.mouse.move(25, 90, { steps: 12 });
	await page.mouse.up();
	const dock = await page.locator('.feedback-toolbar').boundingBox();
	expect(dock!.y).toBeLessThan(120);
	await page.getByRole('button', { name: 'Feedback settings', exact: true }).click();
	const tray = await page.locator('.feedback-tray').boundingBox();
	expect(tray!.x).toBeGreaterThanOrEqual(0);
	expect(tray!.x + tray!.width).toBeLessThanOrEqual(320);
	expect(tray!.y).toBeGreaterThanOrEqual(dock!.y + dock!.height);
	await page.getByRole('button', { name: 'Reset toolbar position' }).click();
	await expect
		.poll(async () => (await page.locator('.feedback-toolbar').boundingBox())!.y)
		.toBeGreaterThan(900);
	await page.getByRole('button', { name: 'Page note', exact: true }).click();
	const card = await page.locator('.feedback-composer').boundingBox();
	expect(card!.x).toBeGreaterThanOrEqual(0);
	expect(card!.x + card!.width).toBeLessThanOrEqual(320);
	expect(card!.y + card!.height).toBeLessThan(942);
	await page.screenshot({ path: test.info().outputPath('mobile-composer.png') });
});

test('reduced motion suppresses toolbar and composer entrance motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const sample = await demo(page);
	await page.getByRole('button', { name: 'Select element', exact: true }).click();
	await sample.locator('h4').click();
	for (const selector of ['.feedback-toolbar', '.feedback-composer']) {
		expect(
			await page.locator(selector).evaluate((node) => getComputedStyle(node).animationName)
		).toBe('none');
	}
});
