import { expect, test } from './shared-browser';
import AxeBuilder from '@axe-core/playwright';

test('message retry, edit/resend, cancellation, and feedback undo work', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-recovery"]');
	await demo.getByRole('button', { name: 'Retry message', exact: true }).click();
	await expect(demo.locator('[data-status="sent"]')).toBeVisible();
	await demo.getByRole('button', { name: 'Edit message', exact: true }).click();
	await expect(demo.getByRole('textbox', { name: 'Edit message', exact: true })).toBeFocused();
	await demo.getByRole('textbox').fill('Edited release prompt');
	await demo.getByRole('textbox').press('Control+Enter');
	await expect(demo.locator('[data-slot="chat-message-bubble"]').first()).toHaveText(
		'Edited release prompt'
	);
	await expect(demo.getByRole('button', { name: 'Edit message', exact: true })).toBeFocused();
	await demo.getByRole('button', { name: 'Edit message', exact: true }).click();
	await demo.getByRole('textbox').fill('Discard this');
	await demo.getByRole('textbox').press('Escape');
	await expect(demo.locator('[data-slot="chat-message-bubble"]').first()).toHaveText(
		'Edited release prompt'
	);
	const up = demo.getByRole('button', { name: 'Good response', exact: true });
	const down = demo.getByRole('button', { name: 'Bad response', exact: true });
	await up.click();
	await expect(up).toHaveAttribute('aria-pressed', 'true');
	await down.click();
	await expect(up).toHaveAttribute('aria-pressed', 'false');
	await expect(down).toHaveAttribute('aria-pressed', 'true');
	await down.click();
	await expect(down).toHaveAttribute('aria-pressed', 'false');
	expect(errors).toEqual([]);
});

test('rejected retry and edit keep content available for another attempt', async ({ page }) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-recovery"]');
	await demo.getByRole('button', { name: 'Simulate failed retry' }).click();
	await demo.getByRole('button', { name: 'Retry message', exact: true }).click();
	await expect(demo.getByRole('alert')).toContainText('Retry failed');
	await demo.getByRole('button', { name: 'Retry message', exact: true }).click();
	await expect(demo.locator('[data-status="sent"]')).toBeVisible();
	await demo.getByRole('button', { name: 'Simulate failed retry' }).click();
	await demo.getByRole('button', { name: 'Edit message', exact: true }).click();
	await demo.getByRole('textbox').fill('Keep this edit');
	await demo.getByRole('button', { name: 'Save and resend' }).click();
	await expect(demo.getByRole('alert')).toContainText('Could not resend');
	await expect(demo.getByRole('textbox')).toHaveValue('Keep this edit');
	await demo.getByRole('button', { name: 'Save and resend' }).click();
	await expect(demo.locator('[data-slot="chat-message-bubble"]').first()).toHaveText(
		'Keep this edit'
	);
});

test('uploads expose progress, cancellation, retry, and gate sending until complete', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-uploads"]');
	await demo.locator('input[type="file"]').setInputFiles([
		{ name: 'one.txt', mimeType: 'text/plain', buffer: Buffer.from('one') },
		{ name: 'two.txt', mimeType: 'text/plain', buffer: Buffer.from('two') }
	]);
	const send = demo.getByRole('button', { name: 'Send', exact: true });
	await expect(send).toBeDisabled();
	await expect(demo.getByRole('progressbar', { name: 'Uploading one.txt' })).toHaveAttribute(
		'value',
		'25'
	);
	await demo.getByRole('button', { name: 'Advance progress' }).click();
	await expect(demo.getByRole('progressbar', { name: 'Uploading one.txt' })).toHaveAttribute(
		'value',
		'75'
	);
	await demo.getByRole('button', { name: 'Cancel upload: one.txt', exact: true }).click();
	await expect(demo.locator('[data-upload-status="cancelled"]')).toContainText('Upload cancelled');
	await demo.getByRole('button', { name: 'Retry upload: one.txt', exact: true }).click();
	await expect(demo.getByRole('progressbar')).toHaveCount(2);
	await demo.getByRole('button', { name: 'Fail uploads' }).click();
	await expect(demo.locator('[data-upload-status="error"]')).toHaveCount(2);
	await expect(send).toBeDisabled();
	await demo.getByRole('button', { name: 'Remove file: two.txt', exact: true }).click();
	await demo.getByRole('button', { name: 'Retry upload: one.txt', exact: true }).click();
	await demo.getByRole('button', { name: 'Complete uploads' }).click();
	await expect(send).toBeEnabled();
	await send.click();
	await expect(demo.getByRole('status')).toContainText('Sent 1 attachment(s).');
	await expect(demo.locator('[data-slot="chat-composer-file"]')).toHaveCount(0);
});

test('history distinguishes empty, loading and error and restores after retry', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-history"]');
	await expect(demo.locator('[data-slot="chat-empty"]')).toBeVisible();
	await demo.getByRole('button', { name: 'Plan a release', exact: true }).click();
	await expect(demo.getByRole('textbox')).toHaveValue('Plan a release');
	await demo.getByRole('button', { name: 'Loading', exact: true }).click();
	await expect(demo.locator('[data-slot="chat-loading"]')).toBeVisible();
	await expect(demo.locator('[data-slot="chat-empty"]')).toHaveCount(0);
	await expect(demo.getByRole('textbox')).toBeDisabled();
	await demo.getByRole('button', { name: 'Load error', exact: true }).click();
	await expect(demo.getByRole('alert')).toContainText('Could not load this conversation');
	await demo.getByRole('button', { name: 'Retry loading conversation', exact: true }).click();
	await expect(demo.locator('[data-message-id]')).toHaveCount(8);
	await expect(demo.getByRole('textbox')).toHaveValue('Plan a release');
});

test('prepending history preserves the visible message; failed loads are retryable', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-history"]');
	await demo.getByRole('button', { name: 'Fail next history load', exact: true }).click();
	const view = demo.locator('[data-slot="chat-message-viewport"]');
	await view.evaluate((node) => {
		node.scrollTop = 60;
	});
	const load = demo.getByRole('button', { name: 'Load older messages', exact: true });
	await load.click();
	await expect(demo.getByRole('alert')).toContainText('Could not load older messages');
	await expect(demo.locator('[data-message-id]')).toHaveCount(8);
	// Measure relative to the viewport so outer card/page scrolling is irrelevant.
	const anchor = demo.locator('[data-message-id="3"]');
	const offset = () =>
		anchor.evaluate(
			(node) =>
				node.getBoundingClientRect().top -
				node.closest('[data-slot="chat-message-viewport"]')!.getBoundingClientRect().top
		);
	const before = await offset();
	await load.click();
	await expect(demo.locator('[data-message-id]')).toHaveCount(14);
	expect(Math.abs((await offset()) - before)).toBeLessThan(2);
	await expect(demo.getByRole('alert')).toHaveCount(0);
	await load.click();
	await expect(demo.locator('[data-message-id]')).toHaveCount(20);
	await expect(load).toHaveCount(0);
	await expect(demo).toContainText('Beginning of conversation');
});

test('feature docs have copyable code, accessible states, and fit mobile themes', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/components/chat');
	for (const slug of ['chat-recovery', 'chat-uploads', 'chat-history']) {
		const card = page.locator(`#${slug}`);
		await card.getByRole('tab', { name: 'Code', exact: true }).click();
		await expect(card.locator('pre')).toContainText('Chat.');
		await card.getByRole('tab', { name: 'Preview', exact: true }).click();
	}
	for (const dark of [false, true]) {
		await page.evaluate((value) => document.documentElement.classList.toggle('dark', value), dark);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		const result = await new AxeBuilder({ page })
			.include('#chat-recovery')
			.include('#chat-uploads')
			.include('#chat-history')
			.disableRules(['color-contrast'])
			.analyze();
		expect(result.violations).toEqual([]);
	}
});
