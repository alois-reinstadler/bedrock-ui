import { expect, test } from '../../../../scripts/shared-browser-test';

test.describe('ERP demo', () => {
	test('orders remain searchable through the data table', async ({ page }) => {
		await page.goto('/demo/erp');
		const table = page.locator('[data-slot="data-table"]');
		const input = table.getByRole('searchbox', { name: 'Tabelle durchsuchen' });
		await input.fill('no-matching-order-12345');
		await expect(table.getByText('Keine Ergebnisse.')).toBeVisible();
		await input.clear();
		await expect(table.getByText('Keine Ergebnisse.')).toHaveCount(0);
		await expect(table.locator('tbody tr').first()).toBeVisible();
	});

	test('orders table keeps its German localization overrides', async ({ page }) => {
		await page.goto('/demo/erp');
		await expect(page.getByText('Zeilen pro Seite')).toBeVisible();
		await expect(page.getByText(/von \d+ Einträgen/)).toBeVisible();
	});
});

test.describe('Chat demo', () => {
	test('renders the AI-chat anatomy', async ({ page }) => {
		await page.goto('/demo/chat');
		await expect(page.locator('[data-slot="chat-tool-calls"]').first()).toBeVisible();
		await expect(page.locator('[data-slot="chat-reasoning"]').first()).toBeVisible();
		await expect(page.locator('[data-slot="chat-suggestions"]').first()).toBeVisible();
		// Closed Collapsible content stays mounted but hidden; match a visible copy.
		await expect(page.locator('[data-slot="markdown"]:visible').first()).toBeVisible();
		await expect(page.locator('[data-slot="chat-composer"]').first()).toBeVisible();
	});
});

test.describe('Tabs shared indicator', () => {
	test('one pill follows the active trigger', async ({ page }) => {
		await page.goto('/docs/components/tabs');
		const list = page.locator('[data-slot="tabs-list"]').first();
		const pill = list.locator('[data-slot="tabs-indicator"]');
		await expect(pill).toHaveCount(1);

		const triggers = list.locator('[data-slot="tabs-trigger"]');
		await triggers.nth(1).click();
		// The pill settles aligned with the newly active trigger.
		await expect
			.poll(async () => {
				const [pillBox, triggerBox] = await Promise.all([
					pill.boundingBox(),
					triggers.nth(1).boundingBox()
				]);
				return pillBox && triggerBox ? Math.abs(pillBox.x - triggerBox.x) : Infinity;
			})
			.toBeLessThan(1.5);
	});
});
