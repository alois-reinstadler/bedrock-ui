import { test, expect } from '../../../scripts/shared-browser-test';
import AxeBuilder from '@axe-core/playwright';

test('feedback docs support real selection, exports and persisted review on desktop and mobile', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/docs/tools/page-annotations');
	await page.getByRole('region', { name: 'Page annotations example' }).scrollIntoViewIfNeeded();
	await page.getByRole('button', { name: 'Leave feedback', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Close feedback' })).toBeFocused();
	await page.getByRole('button', { name: 'Select element', exact: true }).click();
	await page.getByRole('button', { name: 'Explore the studio', exact: true }).click();
	await page
		.getByRole('textbox', { name: 'What would you like to change?' })
		.fill('Book a studio tour');
	await page.getByRole('button', { name: 'Add note', exact: true }).click();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
	await expect(
		page.getByText('Try selecting the button without activating it.', { exact: true })
	).toBeVisible();
	await expect(page.getByRole('button', { name: 'Edit note 1: Explore the studio' })).toBeVisible();
	await page.getByRole('button', { name: 'Feedback settings', exact: true }).click();
	await expect(page.getByRole('button', { name: /^Export JSON/ })).toBeVisible();
	const downloadPromise = page.waitForEvent('download');
	await page.getByRole('button', { name: /^Export JSON/ }).click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toBe('bedrock-feedback.json');
	const payload = await page.evaluate(() =>
		JSON.parse(localStorage.getItem('bedrock:feedback-demo:v1')!)
	);
	expect(payload.annotations[0].target.selector).toBe('[data-feedback-id="feedback-demo-button"]');
	expect(payload.annotations[0].target.styles).toBeUndefined();
	await page.reload();
	await page.getByRole('button', { name: /^Leave feedback/ }).click();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
	await expect(page.getByText('Book a studio tour', { exact: true })).toBeVisible();
	await page.setViewportSize({ width: 390, height: 844 });
	const panel = page.getByRole('group', { name: 'Your feedback 1', exact: true });
	const box = await panel.boundingBox();
	expect(box).not.toBeNull();
	expect(box!.x).toBeGreaterThanOrEqual(0);
	expect(box!.x + box!.width).toBeLessThanOrEqual(390);
	await page.getByRole('button', { name: 'Page note', exact: true }).click();
	await page
		.getByRole('textbox', { name: 'What would you like to change?' })
		.fill('Mobile review works');
	await page.getByRole('button', { name: 'Add note', exact: true }).click();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
	await expect(page.getByText('Mobile review works', { exact: true })).toBeVisible();
	await expect(
		page.getByRole('button', { name: 'Preview notes', exact: true }).locator('.feedback-tooltip')
	).toBeHidden();
	const accessibility = await new AxeBuilder({ page }).include('[data-feedback-ui]').analyze();
	expect(accessibility.violations).toEqual([]);
	expect(errors).toEqual([]);
});

test('feedback properties document the native API', async ({ page }) => {
	await page.goto('/docs/tools/page-annotations?tab=properties');
	await expect(page.getByRole('heading', { name: 'Public API', exact: true })).toBeVisible({
		timeout: 15000
	});
	await expect(
		page
			.locator('code')
			.filter({ hasText: /^onSubmit$/ })
			.first()
	).toBeVisible();
	await expect(
		page
			.locator('code')
			.filter({ hasText: /^storageKey$/ })
			.first()
	).toBeVisible();
});

test('page annotations belongs to Tools and preserves legacy documentation links', async ({
	page
}) => {
	await page.goto('/docs/tools');
	await expect(page.getByRole('heading', { name: 'Tools', exact: true })).toBeVisible();
	await page.locator('article').getByRole('link', { name: 'Page annotations' }).click();
	await expect(page).toHaveURL(/\/docs\/tools\/page-annotations$/);
	await expect(page.getByRole('heading', { name: 'Page annotations', exact: true })).toBeVisible();
	const tabs = page.getByRole('navigation', { name: 'Page annotations documentation' });
	await tabs.getByRole('link', { name: 'Properties', exact: true }).click();
	await expect(page).toHaveURL(/\/docs\/tools\/page-annotations\?tab=properties$/);
	await expect(page.getByRole('heading', { name: 'Public API', exact: true })).toBeVisible();
	await tabs.getByRole('link', { name: 'Accessibility', exact: true }).click();
	await expect(page).toHaveURL(/\/docs\/tools\/page-annotations\?tab=accessibility$/);
	await page.goto('/docs/components/feedback?tab=properties#api');
	await expect(page).toHaveURL(/\/docs\/tools\/page-annotations\?tab=properties#api$/);
	await expect(page.getByRole('heading', { name: 'Public API', exact: true })).toBeVisible();
	await page.goto('/docs/components');
	await expect(
		page.locator('article').getByRole('link', { name: /Page annotations|Feedback/ })
	).toHaveCount(0);
	await page.getByRole('textbox', { name: 'Search documentation' }).fill('feedback');
	await expect(page.getByRole('link', { name: /Page annotations/ })).toHaveAttribute(
		'href',
		'/docs/tools/page-annotations'
	);
});
