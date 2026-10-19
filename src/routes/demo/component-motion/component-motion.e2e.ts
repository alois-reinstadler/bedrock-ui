import { expect, test } from '../../../../scripts/shared-browser-test';

test('component motion keeps menus, disclosures and new messages usable', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/demo/component-motion');
	await page.getByRole('button', { name: 'Soft menu', exact: true }).click();
	const menu = page.getByRole('menu');
	await expect(menu).toBeVisible();
	await expect(menu).toHaveAttribute('data-motion-style', 'soft');
	await page.keyboard.press('ArrowDown');
	await expect(page.getByRole('menuitem', { name: 'Open document' })).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(menu).toHaveCount(0);
	await page.getByRole('button', { name: 'Soft prose reveal' }).click();
	await expect(
		page.getByText('A short explanation sharpens early', { exact: false })
	).toBeVisible();
	await page.getByRole('tab', { name: 'Activity', exact: true }).click();
	await expect(page.getByRole('tabpanel')).toContainText('Recent changes');
	await page.getByRole('button', { name: 'Add a message' }).click();
	await expect(page.locator('[data-slot="chat-message"][data-entry="true"]')).toHaveCount(1);
	await expect(page.getByText('Existing conversation history stays still.')).toBeVisible();
	expect(errors).toEqual([]);
});

test('application reduction reaches dialog portals and mobile layout', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/demo/component-motion');
	await page.getByRole('checkbox', { name: 'Reduce motion' }).check();
	await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toHaveAttribute('data-bedrock-motion', 'reduced');
	await expect(dialog).toHaveCSS('transition-duration', '0s');
	await expect(page.getByRole('textbox', { name: 'Project name' })).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Open dialog', exact: true })).toBeFocused();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
