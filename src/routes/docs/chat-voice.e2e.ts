import { expect, test } from './shared-browser';
import AxeBuilder from '@axe-core/playwright';

test('voice capture states preserve drafts, gate send, and insert a reviewable transcript', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-voice"]');
	await demo.getByRole('button', { name: 'Demo controls', exact: true }).click();
	const draft = demo.getByRole('textbox');
	const send = demo.getByRole('button', { name: 'Send', exact: true });
	await draft.fill('Keep my draft.');
	await demo.getByRole('button', { name: 'Start voice input', exact: true }).click();
	await expect(demo).toContainText('Waiting for microphone access');
	await expect(send).toBeDisabled();
	await draft.press('Enter');
	await expect(draft).toHaveValue('Keep my draft.');
	await demo.getByRole('button', { name: 'Allow microphone (demo)', exact: true }).click();
	await demo.getByRole('button', { name: 'Add 5 seconds', exact: true }).click();
	await expect(demo.getByLabel('Recording duration')).toHaveText('0:05');
	await expect(demo.getByRole('meter')).toHaveAttribute('value', '0.65');
	await demo.getByRole('button', { name: 'Finish recording', exact: true }).click();
	await expect(demo).toContainText('Processing audio');
	await expect(send).toBeDisabled();
	await demo.getByRole('button', { name: 'Insert sample transcript', exact: true }).click();
	await expect(draft).toHaveValue('Keep my draft. Please summarize this conversation.');
	await send.click();
	await expect(draft).toHaveValue('');
	await expect(demo).toContainText('Sent: Keep my draft. Please summarize this conversation.');
	expect(errors).toEqual([]);
});

test('voice can cancel, recover from rejected start, retry denied access, and show unsupported', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-voice"]');
	await demo.getByRole('button', { name: 'Demo controls', exact: true }).click();
	await demo.getByRole('textbox').fill('Unchanged');
	await demo.getByRole('button', { name: 'Fail next start', exact: true }).click();
	await demo.getByRole('button', { name: 'Start voice input', exact: true }).click();
	await expect(demo.getByRole('alert')).toContainText('Voice input failed');
	await demo.getByRole('button', { name: 'Start voice input', exact: true }).click();
	await expect(demo.getByRole('alert')).toHaveCount(0);
	await demo.getByRole('button', { name: 'Cancel voice input', exact: true }).click();
	await expect(demo.getByRole('textbox')).toHaveValue('Unchanged');
	await demo.getByRole('button', { name: 'Microphone denied', exact: true }).click();
	await demo.getByRole('button', { name: 'Retry voice input', exact: true }).click();
	await demo.getByRole('button', { name: 'Allow microphone (demo)', exact: true }).click();
	await demo.getByRole('button', { name: 'Cancel voice input', exact: true }).click();
	await expect(demo.locator('[data-slot="chat-voice"]')).toHaveAttribute('data-state', 'idle');
	await demo.getByRole('button', { name: 'Unsupported browser', exact: true }).click();
	await expect(demo).toContainText('Voice input is unavailable');
	await expect(demo.getByRole('button', { name: 'Send', exact: true })).toBeEnabled();
});

test('voice example has source, accessible recording controls, and fits mobile themes', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/components/chat');
	const card = page.locator('#chat-voice');
	await card.getByRole('tab', { name: 'Code', exact: true }).click();
	await expect(card.locator('pre')).toContainText('Chat.Composer');
	await card.getByRole('tab', { name: 'Preview', exact: true }).click();
	await card.getByRole('button', { name: 'Demo controls', exact: true }).click();
	await card.getByRole('button', { name: 'Start voice input', exact: true }).click();
	await card.getByRole('button', { name: 'Allow microphone (demo)', exact: true }).click();
	for (const dark of [false, true]) {
		await page.evaluate((value) => document.documentElement.classList.toggle('dark', value), dark);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		expect(
			(
				await new AxeBuilder({ page })
					.include('#chat-voice')
					.disableRules(['color-contrast'])
					.analyze()
			).violations
		).toEqual([]);
	}
	await card.screenshot({ path: '/tmp/bedrock-chat-voice.png' });
});
