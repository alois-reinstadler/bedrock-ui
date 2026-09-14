import { expect, test } from '@playwright/test';

test('mail search, selection, archive, compose, and calendar work locally', async ({ page }) => {
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page.getByRole('textbox', { name: 'Search mail' }).fill('Research window');
	await expect(page.locator('.message-summary')).toHaveCount(1);
	await page.getByRole('textbox', { name: 'Search mail' }).fill('no matching message');
	await expect(page.getByText('No messages here')).toBeVisible();
	await page.getByRole('button', { name: 'Clear search' }).click();
	await page.getByRole('checkbox', { name: 'Select message from June Park' }).check();
	await page.getByRole('button', { name: 'Archive selected', exact: true }).click();
	await expect(page.locator('.message-summary')).toHaveCount(4);
	await page.getByRole('button', { name: 'Compose', exact: false }).first().click();
	await page.getByRole('textbox', { name: 'To', exact: true }).fill('friend@example.com');
	await page.getByRole('textbox', { name: 'Subject', exact: true }).fill('A local hello');
	await page
		.getByRole('textbox', { name: 'Message', exact: true })
		.fill('See you at the workshop.');
	await page.getByRole('button', { name: 'Send message', exact: true }).click();
	await page
		.getByRole('navigation', { name: 'Mailbox', exact: true })
		.getByRole('button', { name: 'Sent' })
		.click();
	await expect(page.locator('.message-summary').filter({ hasText: 'A local hello' })).toBeVisible();
	await page.getByRole('button', { name: 'Open calendar' }).first().click();
	await page.getByRole('button', { name: 'Accept invitation' }).click();
	await expect(page.getByRole('status')).toHaveText('Added to your demo calendar.');
});

test('mobile reading returns focus to the list and keeps layout within viewport', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page.locator('.message-summary').first().click();
	await expect(page.locator('#mail-reader-heading')).toBeFocused();
	await page.getByRole('button', { name: 'Back to messages' }).click();
	await expect(page.locator('#mail-list-heading')).toBeFocused();
	await page.getByRole('button', { name: 'Open folders' }).click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).toHaveCount(0);
	const overflows = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
	expect(overflows).toBe(false);
});

test('mobile standard motion focuses the opened message', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page.locator('.message-summary').first().click();
	await expect(page.locator('#mail-reader-heading')).toBeFocused();
});
