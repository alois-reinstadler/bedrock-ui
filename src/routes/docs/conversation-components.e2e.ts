import { expect, test } from './shared-browser';
import AxeBuilder from '@axe-core/playwright';

const families = ['attachment', 'bubble', 'message', 'marker'];
for (const family of families) {
	test(`${family} has working preview/code cards, matching source, and accessible controls`, async ({
		page,
		request
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto(`/docs/components/${family}`);
		if (family === 'attachment') {
			const previewImage = page.locator('#preview img');
			await expect
				.poll(() => previewImage.evaluate((node: HTMLImageElement) => node.naturalWidth))
				.toBe(1600);
		}
		for (const [section, kind] of [
			['preview', 'previews'],
			['examples', 'examples']
		]) {
			const card = page.locator(`#${section} [data-slot="example-card"]`);
			await expect(card).toHaveCount(1);
			await expect(card.getByRole('tab', { name: 'Preview', exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);
			await expect(card.getByRole('tabpanel', { name: 'Preview', exact: true })).toBeVisible();
			const height = (await card.boundingBox())!.height;
			await card.getByRole('tab', { name: 'Preview', exact: true }).focus();
			await page.keyboard.press('ArrowRight');
			await expect(card.getByRole('tab', { name: 'Code', exact: true })).toHaveAttribute(
				'aria-selected',
				'true'
			);
			const source = await (
				await request.get(`/docs/examples/${kind}/${family}/source.json`)
			).json();
			await expect(card.locator('pre')).toHaveText(source.code);
			expect(Math.abs((await card.boundingBox())!.height - height)).toBeLessThan(2);
			await page.keyboard.press('ArrowLeft');
			await expect(card.getByRole('tabpanel', { name: 'Preview', exact: true })).toBeVisible();
		}
		const results = await new AxeBuilder({ page })
			.include('#preview')
			.include('#examples')
			.disableRules(['color-contrast'])
			.analyze();
		expect(results.violations).toEqual([]);
		expect(errors).toEqual([]);
	});
}

test('attachment actions remain independent of the whole-card trigger and upload state survives tab changes', async ({
	page
}) => {
	await page.goto('/docs/components/attachment');
	const example = page.locator('#examples');
	await example.getByRole('button', { name: 'Retry upload', exact: true }).click();
	await expect(example.locator('[data-slot="attachment"]')).toHaveAttribute(
		'data-state',
		'uploading'
	);
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await example.getByRole('tab', { name: 'Code', exact: true }).click();
	await expect(example.locator('pre')).toBeVisible();
	await example.getByRole('tab', { name: 'Preview', exact: true }).click();
	await expect(example.locator('[data-slot="attachment"]')).toHaveAttribute(
		'data-state',
		'uploading'
	);
	await example.getByRole('button', { name: 'Process upload', exact: true }).click();
	await expect(example.locator('[data-slot="attachment"]')).toHaveAttribute(
		'data-state',
		'processing'
	);
	await example.getByRole('button', { name: 'Complete upload', exact: true }).click();
	await expect(example.locator('[data-slot="attachment"]')).toHaveAttribute('data-state', 'done');
	await example.getByRole('button', { name: 'Preview project-brief.pdf', exact: true }).focus();
	await page.keyboard.press('Enter');
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(
		page.locator('#preview [data-state="uploading"] [data-slot="attachment-title"]')
	).toHaveCSS('animation-name', 'none');
});

test('bubble supports native keyboard replies and toggle reactions', async ({ page }) => {
	await page.goto('/docs/components/bubble');
	const example = page.locator('#examples');
	await expect(page.locator('#preview [data-slot="bubble"]')).toHaveCount(7);
	const reply = example.getByRole('button', { name: 'Thanks, I will take a look.', exact: true });
	await reply.focus();
	await page.keyboard.press('Enter');
	await expect(example.getByRole('status').first()).toContainText('Reply sent:');
	const reaction = example.getByRole('button', { name: 'Like message', exact: true });
	await reaction.click();
	await expect(reaction).toHaveAttribute('aria-pressed', 'true');
	await reaction.press('Space');
	await expect(reaction).toHaveAttribute('aria-pressed', 'false');
});

test('message reply and marker action update their visible status', async ({ page }) => {
	await page.goto('/docs/components/message');
	await page
		.locator('#examples')
		.getByRole('button', { name: 'Reply to Ari', exact: true })
		.click();
	await expect(page.locator('#examples [data-slot="message"][data-align="end"]')).toContainText(
		'I will review them this morning.'
	);
	await page.goto('/docs/components/marker');
	const button = page
		.locator('#examples')
		.getByRole('button', { name: 'Complete review', exact: true });
	await button.focus();
	await page.keyboard.press('Space');
	await expect(page.locator('#examples [data-slot="marker"][role="status"]')).toContainText(
		'Review complete.'
	);
});

test('cards copy exact source, provide success/failure feedback, and preserve focus with the HTTP fallback', async ({
	page,
	request
}) => {
	await page.goto('/docs/components/bubble');
	const card = page.locator('#examples [data-slot="example-card"]');
	const source = await (await request.get('/docs/examples/examples/bubble/source.json')).json();
	await page.evaluate(() => {
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: {
				writeText: async (text: string) => {
					Reflect.set(window, 'copiedExample', text);
				}
			}
		});
	});
	const copy = card.getByRole('button', { name: 'Copy code for Bubble example', exact: true });
	await copy.click();
	await expect(card).toContainText('Code copied to clipboard.');
	expect(await page.evaluate(() => Reflect.get(window, 'copiedExample'))).toBe(source.code);
	await page.evaluate(() => {
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
		document.execCommand = () => {
			Reflect.set(window, 'fallbackCopied', (document.activeElement as HTMLTextAreaElement).value);
			return true;
		};
	});
	await copy.focus();
	await copy.press('Enter');
	await expect(copy).toBeFocused();
	expect(await page.evaluate(() => Reflect.get(window, 'fallbackCopied'))).toBe(source.code);
	await page.evaluate(() => {
		document.execCommand = () => false;
	});
	await copy.click();
	await expect(card).toContainText(
		'Copy failed. Open Code and select the text to copy it manually.'
	);
});

test('source fetch failure offers a working retry', async ({ page }) => {
	let attempts = 0;
	await page.route('**/docs/examples/previews/marker/source.json', (route) =>
		++attempts === 1 ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.continue()
	);
	await page.goto('/docs/components/marker');
	const card = page.locator('#preview [data-slot="example-card"]');
	await card.getByRole('tab', { name: 'Code', exact: true }).click();
	await expect(card.getByRole('alert')).toContainText('Code could not load');
	await card.getByRole('button', { name: 'Retry loading code', exact: true }).click();
	await expect(card.locator('pre')).toContainText('Marker.Root');
	expect(attempts).toBe(2);
});

test('shared cards cover blocks, forms, installation, motion, and the button playground', async ({
	page
}) => {
	for (const path of [
		'/docs/blocks/authentication-panel',
		'/docs/forms',
		'/docs/installation',
		'/docs/motion',
		'/docs/components/button?tab=properties'
	]) {
		await page.goto(path);
		const card = page.locator('[data-slot="example-card"]').first();
		await expect(card).toBeVisible();
		await card.getByRole('tab', { name: 'Code', exact: true }).click();
		await expect(card.locator('pre')).toBeVisible();
		await card.getByRole('tab', { name: 'Preview', exact: true }).click();
		await expect(card.getByRole('tabpanel', { name: 'Preview', exact: true })).toBeVisible();
	}
});

test('new component previews fit mobile widths in both themes', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	for (const family of families) {
		await page.goto(`/docs/components/${family}`);
		for (const dark of [false, true]) {
			await page.evaluate(
				(value) => document.documentElement.classList.toggle('dark', value),
				dark
			);
			const card = page.locator('#preview [data-slot="example-card"]');
			await expect(card).toHaveClass(/bg-background/);
			expect(await card.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
			).toBe(true);
		}
	}
});
