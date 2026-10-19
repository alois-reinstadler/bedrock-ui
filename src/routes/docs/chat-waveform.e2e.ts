import { expect, test } from '../../../scripts/shared-browser-test';
import AxeBuilder from '@axe-core/playwright';

// Feed a quiet, real Web Audio stream through the browser's actual MediaRecorder.
// Only permission/hardware acquisition is replaced; analysis and encoding are real.
async function installMicrophone(page: import('@playwright/test').Page) {
	await page.addInitScript(() => {
		const resources: { context: AudioContext; stream: MediaStream }[] = [];
		Object.assign(window, { audioTestResources: resources });
		Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
			configurable: true,
			value: async () => {
				const context = new AudioContext();
				await context.resume();
				const oscillator = context.createOscillator();
				const gain = context.createGain();
				const destination = context.createMediaStreamDestination();
				oscillator.frequency.value = 180;
				gain.gain.value = 0.028;
				oscillator.connect(gain).connect(destination);
				oscillator.start();
				resources.push({ context, stream: destination.stream });
				return destination.stream;
			}
		});
	});
}

test('quiet microphone records, animates, plays back and releases capture', async ({ page }) => {
	await installMicrophone(page);
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/chat#chat-waveform');
	const demo = page.locator('[data-demo="chat-waveform"]');
	await demo.getByRole('button', { name: 'Record audio', exact: true }).click();
	await expect(demo.getByRole('status')).toHaveText('Listening');
	const meter = demo.getByRole('meter');
	await expect.poll(async () => Number(await meter.getAttribute('value'))).toBeGreaterThan(0.01);
	await expect.poll(async () => Number(await meter.getAttribute('value'))).toBeLessThan(0.04);
	const path = demo.locator('[data-wave="0"]');
	await expect
		.poll(async () => {
			const values = (await path.getAttribute('d'))!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
			return Math.max(...values.filter((_, index) => index % 2 === 1)) - 48;
		})
		.toBeGreaterThan(10);
	await expect(demo.getByRole('timer')).not.toHaveText('0:00');
	await demo.getByRole('button', { name: 'Finish recording', exact: true }).click();
	await expect(demo.getByRole('link', { name: 'Download recording' })).toBeVisible();
	const audio = demo.locator('audio');
	await expect
		.poll(() => audio.evaluate((node) => (node as HTMLAudioElement).readyState))
		.toBeGreaterThan(0);
	await audio.evaluate((node) => (node as HTMLAudioElement).play());
	await expect
		.poll(() => audio.evaluate((node) => (node as HTMLAudioElement).currentTime))
		.toBeGreaterThan(0);
	await audio.evaluate((node) => (node as HTMLAudioElement).pause());
	expect(
		await page.evaluate(() =>
			(
				window as unknown as { audioTestResources: { stream: MediaStream }[] }
			).audioTestResources.every((item) =>
				item.stream.getTracks().every((track) => track.readyState === 'ended')
			)
		)
	).toBe(true);
	await demo.getByRole('button', { name: 'Discard', exact: true }).click();
	await expect(audio).toHaveCount(0);
	await demo.getByRole('button', { name: 'Record audio', exact: true }).click();
	await expect(demo.getByRole('status')).toHaveText('Listening');
	await demo.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(demo.getByRole('status')).toHaveText('Ready when you are');
	await expect(audio).toHaveCount(0);
	await demo.getByRole('button', { name: 'Record audio', exact: true }).click();
	await expect(demo.getByRole('status')).toHaveText('Listening');
	await page.getByRole('link', { name: 'Properties', exact: true }).click();
	await expect(demo).toHaveCount(0);
	expect(errors).toEqual([]);
	await page.evaluate(async () => {
		const resources = (
			window as unknown as { audioTestResources: { context: AudioContext; stream: MediaStream }[] }
		).audioTestResources;
		for (const resource of resources) {
			if (resource.stream.getTracks().some((track) => track.readyState !== 'ended'))
				throw new Error('Capture track leaked');
			await resource.context.close();
		}
	});
});

test('permission denial is recoverable and cancelling pending access discards late streams', async ({
	page
}) => {
	await page.goto('/docs/components/chat#chat-waveform');
	await page.evaluate(() =>
		Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
			configurable: true,
			value: () => Promise.reject(new DOMException('Denied', 'NotAllowedError'))
		})
	);
	const demo = page.locator('[data-demo="chat-waveform"]');
	await demo.getByRole('button', { name: 'Record audio', exact: true }).click();
	await expect(demo.getByRole('alert')).toContainText('Microphone access was denied');
	await page.evaluate(() =>
		Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
			configurable: true,
			value: () =>
				new Promise((resolve) => Object.assign(window, { resolveAudioPermission: resolve }))
		})
	);
	await demo.getByRole('button', { name: 'Record audio', exact: true }).click();
	await expect(demo.getByRole('status')).toHaveText('Allow microphone access');
	await expect.poll(() => page.evaluate(() => 'resolveAudioPermission' in window)).toBe(true);
	await demo.getByRole('button', { name: 'Cancel', exact: true }).click();
	const ended = await page.evaluate(async () => {
		const context = new AudioContext();
		const destination = context.createMediaStreamDestination();
		(
			window as unknown as { resolveAudioPermission: (stream: MediaStream) => void }
		).resolveAudioPermission(destination.stream);
		await new Promise((resolve) => setTimeout(resolve, 100));
		const released = destination.stream.getTracks().every((track) => track.readyState === 'ended');
		await context.close();
		return released;
	});
	expect(ended).toBe(true);
	await expect(demo.getByRole('status')).toHaveText('Ready when you are');
	await expect(demo.locator('audio')).toHaveCount(0);
});

test('waveform preview is accessible, responsive, themed and has usable source', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/docs/components/chat#chat-waveform');
	const card = page.locator('#chat-waveform');
	await card.getByRole('button', { name: 'Preview quiet voice', exact: true }).click();
	await expect(card.locator('[data-demo="chat-waveform"]').getByRole('status')).toHaveText(
		'Quiet voice preview'
	);
	for (const dark of [false, true]) {
		await page.evaluate((value) => document.documentElement.classList.toggle('dark', value), dark);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		expect((await new AxeBuilder({ page }).include('#chat-waveform').analyze()).violations).toEqual(
			[]
		);
	}
	await card.screenshot({ path: '/tmp/bedrock-waveform-mobile.png' });
	await card.getByRole('button', { name: 'Stop preview', exact: true }).click();
	await expect(card.locator('[data-slot="chat-waveform"]')).toHaveAttribute('data-active', 'false');
	await card.getByRole('tab', { name: 'Code', exact: true }).click();
	await expect(card.locator('pre')).toContainText('Chat.Waveform');
});
