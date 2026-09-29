import { expect, test } from './shared-browser';
import AxeBuilder from '@axe-core/playwright';

test('optional model search, provider filters, favorites, reasoning and service tier feed the message', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/chat');
	const example = page.locator('#examples > section').first();
	await expect(page.locator('#preview [data-slot="chat-composer-toolbar"]')).toHaveCount(0);
	await example.getByRole('button', { name: 'Model: Atlas Pro', exact: true }).click();
	await page.getByRole('button', { name: 'Local', exact: true }).click();
	await expect(page.locator('[data-model-option]')).toHaveCount(1);
	await page.getByRole('button', { name: 'Favorite Local Coder', exact: true }).click();
	await page.getByRole('button', { name: 'Favorites', exact: true }).click();
	await expect(page.locator('[data-model-option]')).toHaveCount(2);
	await page.getByRole('button', { name: 'All models', exact: true }).click();
	await page.getByRole('searchbox', { name: 'Search models…' }).fill('classic');
	await expect(page.locator('[data-model-option]')).toHaveCount(1);
	await page.getByRole('searchbox', { name: 'Search models…' }).press('ArrowDown');
	await page.keyboard.press('Enter');
	await expect(
		example.getByRole('button', { name: 'Model: Atlas Classic', exact: true })
	).toBeFocused();
	await example.getByRole('button', { name: 'Reasoning: High', exact: true }).click();
	await page.getByRole('menuitemradio', { name: 'Extra High', exact: true }).click();
	await example.getByRole('button', { name: 'Reasoning: Extra High', exact: true }).click();
	await page.getByRole('menuitemradio', { name: /Fast/ }).click();
	await example.getByRole('textbox', { name: 'Write a message…' }).fill('Review the release');
	await example.getByRole('button', { name: 'Send', exact: true }).click();
	await expect(example.locator('[data-slot="chat-message-metadata"]').last()).toContainText(
		'Atlas Classic · xhigh · fast'
	);
	await expect(example.getByRole('textbox')).toHaveValue('');
	expect(errors).toEqual([]);
});

test('multiple attachments validate, remove, survive code tabs, and send without text', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const example = page.locator('#examples > section').first();
	const input = example.locator('input[type="file"]');
	await expect(input).toHaveAttribute('multiple', '');
	await input.setInputFiles([
		{ name: 'brief.txt', mimeType: 'text/plain', buffer: Buffer.from('First') },
		{ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('Second') },
		{ name: 'bad.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('No') }
	]);
	await expect(example.locator('[data-slot="chat-composer-file"]')).toHaveCount(2);
	await expect(example.getByRole('alert')).toContainText('Some files could not be added');
	await example.getByRole('button', { name: 'Remove file: notes.txt', exact: true }).click();
	await example.getByRole('tab', { name: 'Code', exact: true }).click();
	await expect(
		example.getByRole('tabpanel', { name: 'Code', exact: true }).locator('pre')
	).toContainText('Chat.Composer');
	await example.getByRole('tab', { name: 'Preview', exact: true }).click();
	await expect(example.locator('[data-slot="chat-composer-file"]')).toHaveCount(1);
	await example.getByRole('button', { name: 'Send', exact: true }).click();
	await expect(example.locator('[data-slot="chat-composer-file"]')).toHaveCount(0);
	await expect(example.locator('[data-slot="chat-attachment"]')).toContainText('brief.txt');
	await expect(example.getByRole('button', { name: 'Send', exact: true })).toBeDisabled();
});

test('paste and drop share the file queue and count limit', async ({ page }) => {
	await page.goto('/docs/components/chat');
	const composer = page
		.locator('#examples > section')
		.first()
		.locator('[data-slot="chat-composer"]');
	for (const kind of ['paste', 'drop']) {
		await composer.evaluate((node, eventType) => {
			const transfer = new DataTransfer();
			for (let i = 0; i < 3; i++)
				transfer.items.add(new File(['data'], `${eventType}-${i}.txt`, { type: 'text/plain' }));
			node.dispatchEvent(
				eventType === 'paste'
					? new ClipboardEvent('paste', {
							clipboardData: transfer,
							bubbles: true,
							cancelable: true
						})
					: new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true })
			);
		}, kind);
	}
	await expect(composer.locator('[data-slot="chat-composer-file"]')).toHaveCount(4);
	await expect(composer.getByRole('alert')).toBeVisible();
});

test('composer and menus remain accessible and fit mobile light and dark themes', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/components/chat');
	for (const dark of [false, true]) {
		await page.evaluate((value) => document.documentElement.classList.toggle('dark', value), dark);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		await page
			.locator('#examples > section')
			.first()
			.getByRole('button', { name: 'Model: Atlas Pro', exact: true })
			.click();
		await expect(page.getByRole('searchbox', { name: 'Search models…' })).toBeVisible();
		const result = await new AxeBuilder({ page })
			.include('[data-slot="chat-model-picker-content"]')
			.disableRules(['color-contrast'])
			.analyze();
		expect(result.violations).toEqual([]);
		await page.keyboard.press('Escape');
		await page
			.locator('#examples > section')
			.first()
			.getByRole('button', { name: 'Reasoning: High', exact: true })
			.click();
		const menu = await new AxeBuilder({ page })
			.include('[data-slot="chat-reasoning-picker-content"]')
			.disableRules(['color-contrast'])
			.analyze();
		expect(menu.violations).toEqual([]);
		await page.keyboard.press('Escape');
	}
	const result = await new AxeBuilder({ page })
		.include('#examples')
		.disableRules(['color-contrast'])
		.analyze();
	expect(result.violations).toEqual([]);
});

test('image previews load and oversized files are rejected', async ({ page }) => {
	await page.goto('/docs/components/chat');
	const example = page.locator('#examples > section').first();
	await example.locator('input[type="file"]').setInputFiles([
		{
			name: 'pixel.png',
			mimeType: 'image/png',
			buffer: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII=',
				'base64'
			)
		},
		{ name: 'large.txt', mimeType: 'text/plain', buffer: Buffer.alloc(5 * 1024 * 1024 + 1) }
	]);
	const image = example.getByRole('img', { name: 'pixel.png', exact: true });
	await expect(image).toBeVisible();
	await expect
		.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
		.toBe(1);
	await expect(example.locator('[data-slot="chat-composer-file"]')).toHaveCount(1);
	await expect(example.getByRole('alert')).toBeVisible();
	await example.getByRole('button', { name: 'Remove file: pixel.png', exact: true }).click();
	await expect(image).toHaveCount(0);
});
