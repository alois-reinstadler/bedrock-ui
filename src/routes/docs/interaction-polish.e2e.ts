import { expect, test } from '@playwright/test';

for (const component of ['clickable-card', 'selectable-card'] as const) {
	for (const forcedColors of ['none', 'active'] as const) {
		test(`${component} keeps keyboard focus visible within its clipped surface (${forcedColors})`, async ({
			page
		}) => {
			await page.emulateMedia({ forcedColors });
			await page.goto(`/docs/components/${component}`);
			const label =
				component === 'clickable-card' ? 'Open Field journal project' : 'Select core sample 07';
			const card = page
				.getByRole('region', { name: 'In practice', exact: true })
				.locator(`[data-slot="${component}"]`)
				.filter({
					has: page.getByRole(component === 'clickable-card' ? 'button' : 'checkbox', {
						name: label,
						exact: true
					})
				});
			const trigger = card.locator(`[data-slot="${component}-trigger"]`);
			await expect(trigger).toBeVisible();

			if (component === 'clickable-card') {
				await card.getByRole('button', { name: 'Pin project', exact: true }).click();
				await expect(
					page.getByRole('status').filter({ hasText: 'Pinned to your library.' })
				).toContainText('Select the card to open');
			}

			const before = await card.boundingBox();
			await trigger.focus();
			await page.keyboard.press('Tab');
			await page.keyboard.press('Shift+Tab');
			await expect(trigger).toBeFocused();
			const focus = await trigger.evaluate((element) => {
				const style = getComputedStyle(element);
				return {
					visible: element.matches(':focus-visible'),
					shadow: style.boxShadow,
					outlineStyle: style.outlineStyle,
					outlineWidth: style.outlineWidth,
					outlineOffset: style.outlineOffset,
					parentOverflow: getComputedStyle(element.parentElement!).overflow
				};
			});
			expect(focus.visible).toBe(true);
			expect(focus.parentOverflow).toBe('hidden');
			if (forcedColors === 'active') {
				expect.soft(focus.outlineStyle).toBe('solid');
				expect.soft(focus.outlineWidth).toBe('2px');
				expect.soft(focus.outlineOffset).toBe('-2px');
			} else {
				expect.soft(focus.shadow).toContain('inset');
			}
			const after = await card.boundingBox();
			expect(after?.width).toBe(before?.width);
			expect(after?.height).toBe(before?.height);
			await test
				.info()
				.attach('keyboard-focus', { body: await card.screenshot(), contentType: 'image/png' });

			await page.keyboard.press('Space');
			await expect(trigger).toBeFocused();
			if (component === 'selectable-card') {
				await expect(trigger).toBeChecked();
				await page.keyboard.press('Enter');
				await expect(trigger).not.toBeChecked();
			} else {
				await expect(
					page.getByRole('status').filter({ hasText: 'Field journal is open' })
				).toBeVisible();
			}
		});
	}
}

test('button disabling immediately follows form content and preserves draft keyboard activation', async ({
	page
}) => {
	await page.goto('/docs/components/button');
	const publish = page.getByRole('button', { name: 'Publish update', exact: true });
	await expect(publish).toBeEnabled();
	await page.getByRole('button', { name: 'Clear', exact: true }).click();
	await expect(publish).toBeDisabled();
	await page.getByRole('textbox', { name: 'Team update' }).fill('Review ready');
	await expect(publish).toBeEnabled();
	const draft = page.getByRole('button', { name: 'Save draft', exact: true });
	await draft.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('status').filter({ hasText: 'Draft saved locally' })).toBeVisible();
	await expect(draft).toBeFocused();
});

test('icon and toggle examples update semantic state on each keyboard activation', async ({
	page
}) => {
	await page.goto('/docs/components/icon-button');
	const favorite = page.locator('[data-slot="icon-button"][aria-pressed]');
	await expect(favorite).toHaveAttribute('aria-pressed', 'false');
	await favorite.focus();
	await page.keyboard.press('Space');
	await expect(favorite).toHaveAttribute('aria-pressed', 'true');
	await page.keyboard.press('Enter');
	await expect(favorite).toHaveAttribute('aria-pressed', 'false');
	await expect(favorite).toBeFocused();

	await page.goto('/docs/components/toggle');
	const toggle = page.getByRole('button', { name: 'Show only items assigned to me' });
	await expect(toggle).toHaveAttribute('aria-pressed', 'false');
	await toggle.focus();
	await page.keyboard.press('Space');
	await expect(toggle).toHaveAttribute('aria-pressed', 'true');
	await expect(
		page.getByRole('status').filter({ hasText: 'Showing 2 review items' })
	).toBeVisible();
	await page.keyboard.press('Enter');
	await expect(toggle).toHaveAttribute('aria-pressed', 'false');
	await expect(
		page.getByRole('status').filter({ hasText: 'Showing 3 review items' })
	).toBeVisible();
	await expect(toggle).toBeFocused();
});
