import { expect, test } from '../../../../scripts/shared-browser-test';

test.beforeEach(async ({ page }) => {
	await page.bringToFront();
	// Exercise loaded-image selection deterministically without a CDN dependency.
	await page.route('https://cdn.jsdelivr.net/npm/emoji-datasource-apple@16.0.0/**', (route) =>
		route.fulfill({
			contentType: 'image/svg+xml',
			body: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="30" fill="gold"/></svg>'
		})
	);
	await page.goto('/docs/components/emoji');
	await expect(page.locator('[data-emoji-copy-example]')).toBeVisible({ timeout: 20_000 });
	await page.evaluate(() => document.fonts.ready);
	await expect
		.poll(() =>
			page
				.locator('[data-emoji-copy-example] [data-state]')
				.evaluateAll(
					(glyphs) =>
						glyphs.length === 4 &&
						glyphs.every((glyph) => glyph.getAttribute('data-state') === 'loaded')
				)
		)
		.toBe(true);
});

test('native copy/paste preserves full, partial and backward selections with mixed text', async ({
	page
}) => {
	const sample = page.locator('[data-emoji-copy-example]');
	const paste = page.getByRole('textbox', { name: 'Paste copied text' });
	for (const [selection, expected] of [
		['full', 'Hello 👩🏽‍💻 🇦🇹 1️⃣ 👨‍👩‍👧‍👦'],
		['partial', '👩🏽‍💻 🇦🇹 1️⃣'],
		['backward', '👩🏽‍💻 🇦🇹 1️⃣'],
		['family', '👨‍👩‍👧‍👦']
	]) {
		await page.bringToFront();
		await sample.scrollIntoViewIfNeeded();
		const selected = await sample.evaluate((element, mode) => {
			// Move focus out of the previous paste target before selecting document text.
			(document.activeElement as HTMLElement)?.blur();
			const selection = getSelection()!;
			selection.removeAllRanges();
			const range = document.createRange();
			const glyphs = element.querySelectorAll('[data-renderer]');
			if (mode === 'full') range.selectNodeContents(element);
			else if (mode === 'family') range.selectNodeContents(glyphs[3]);
			else {
				range.setStart(glyphs[0].firstChild!, 0);
				range.setEnd(glyphs[2].firstChild!, glyphs[2].firstChild!.textContent!.length);
			}
			selection.addRange(range);
			if (mode === 'backward')
				selection.setBaseAndExtent(
					range.endContainer,
					range.endOffset,
					range.startContainer,
					range.startOffset
				);
			return selection.toString();
		}, selection);
		expect(selected).toBe(expected);
		// Test the browser clipboard, not a synthetic copy event or DOM textContent.
		await page.keyboard.press('Control+c');
		await paste.focus();
		await page.keyboard.press('Control+a');
		await page.keyboard.press('Control+v');
		await expect(paste).toHaveValue(expected);
	}
});

test('pointer dragging over Apple artwork selects and copies the underlying emoji', async ({
	page
}) => {
	const glyph = page.locator('[data-emoji-copy-example] [data-renderer]').first();
	await glyph.scrollIntoViewIfNeeded();
	await page.bringToFront();
	const box = await glyph.evaluate((element) => {
		const { x, y, width, height } = element.getBoundingClientRect();
		return { x, y, width, height };
	});
	await page.mouse.move(box.x + 1, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width - 1, box.y + box.height / 2, { steps: 8 });
	await page.mouse.up();
	expect(await page.evaluate(() => getSelection()?.toString())).toBe('👩🏽‍💻');
	await page.keyboard.press('Control+c');
	const paste = page.getByRole('textbox', { name: 'Paste copied text' });
	await paste.focus();
	await page.keyboard.press('Control+v');
	await expect(paste).toHaveValue('👩🏽‍💻');
});

test('dragging already-selected emoji cannot start an image or text ghost', async ({ page }) => {
	const glyph = page.locator('[data-emoji-copy-example] [data-renderer]').first();
	await glyph.scrollIntoViewIfNeeded();
	await page.bringToFront();
	await expect(page.locator('[data-slot="emoji"] img')).toHaveCount(0);
	const box = await glyph.evaluate((element) => {
		const range = document.createRange();
		range.selectNodeContents(element);
		getSelection()!.removeAllRanges();
		getSelection()!.addRange(range);
		document.addEventListener('dragstart', (event) => {
			document.documentElement.dataset.emojiDrag = event.defaultPrevented ? 'cancelled' : 'started';
		});
		const { x, y, width, height } = element.getBoundingClientRect();
		return { x, y, width, height };
	});
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width + 50, box.y + box.height / 2, { steps: 12 });
	await page.mouse.up();
	expect(await page.evaluate(() => document.documentElement.dataset.emojiDrag)).not.toBe('started');
	await expect(page.locator('[data-slot="emoji"] img')).toHaveCount(0);
});
