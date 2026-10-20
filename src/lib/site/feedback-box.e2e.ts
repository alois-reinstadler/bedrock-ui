import { test, expect, type Page } from '../../../scripts/shared-browser-test';

async function setup(page: Page) {
	await page.setViewportSize({ width: 1440, height: 1100 });
	await page.goto('/docs/tools/page-annotations');
	const demo = page.locator('#preview [aria-label="Page annotations example"]');
	await expect(demo).toBeVisible({ timeout: 15000 });
	await demo.locator('[data-feedback-sample]').scrollIntoViewIfNeeded();
	await demo.getByRole('button', { name: 'Review this sample' }).click();
	await expect(page.locator('[data-feedback-ui]')).toHaveCount(1);
	await page.getByRole('button', { name: 'Select element', exact: true }).click();
	const box = await demo.locator('[data-feedback-sample]').evaluate((node) => {
		const title = node.querySelector('h4')!.getBoundingClientRect();
		const button = node.querySelector('button')!.getBoundingClientRect();
		const paragraph = node.querySelector('h4 + p')!.getBoundingClientRect();
		return {
			left: title.left - 6,
			top: title.top - 6,
			right: paragraph.right + 6,
			bottom: button.bottom + 6
		};
	});
	return { demo, box };
}

for (const reverse of [false, true]) {
	test(`docs box selection groups enclosed elements, persists and exports (${reverse ? 'reverse' : 'forward'})`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		const { demo, box } = await setup(page);
		const start = reverse ? [box.right, box.bottom] : [box.left, box.top];
		const end = reverse ? [box.left, box.top] : [box.right, box.bottom];
		await page.mouse.move(start[0], start[1]);
		await page.mouse.down();
		await page.mouse.move(end[0], end[1], { steps: 10 });
		await expect(page.locator('.feedback-box')).toBeVisible();
		await expect(
			page.getByRole('status').filter({ hasText: '3 elements selected' })
		).toBeAttached();
		if (!reverse) await page.screenshot({ path: test.info().outputPath('box-drag.png') });
		await page.mouse.up();
		await expect(
			page.getByRole('list', { name: 'Selected elements' }).getByRole('listitem')
		).toHaveCount(3);
		await expect(page.locator('.feedback-member-highlight')).toHaveCount(3);
		expect(
			await page
				.locator('.feedback-composer, .feedback-group-members')
				.evaluateAll((nodes) => nodes.every((node) => node.scrollWidth <= node.clientWidth + 1))
		).toBe(true);
		await expect(page.locator('.feedback-selection-summary')).toContainText('3 selected elements');
		if (!reverse)
			await page.screenshot({
				path: test.info().outputPath('box-composer.png'),
				animations: 'disabled'
			});
		await expect(
			demo.getByText('Try selecting the button without activating it.', { exact: true })
		).toBeVisible();
		await page
			.getByRole('textbox', { name: 'What would you like to change?' })
			.fill('Give these elements more breathing room.');
		await page.getByRole('button', { name: 'Add note', exact: true }).click();
		const payload = await page.evaluate(() =>
			JSON.parse(localStorage.getItem('bedrock:feedback-demo:v1')!)
		);
		expect(payload.annotations[0].target.kind).toBe('group');
		expect(payload.annotations[0].target.elements.map((item: { tag: string }) => item.tag)).toEqual(
			['h4', 'p', 'button']
		);
		expect(
			payload.annotations[0].target.elements.every(
				(item: { styles?: unknown }) => item.styles === undefined
			)
		).toBe(true);
		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: 'Feedback settings', exact: true }).click();
		await page.getByRole('button', { name: /^Export JSON/ }).click();
		expect((await downloadPromise).suggestedFilename()).toBe('bedrock-feedback.json');
		await page.reload();
		await page.getByRole('button', { name: 'Review this sample' }).click();
		await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
		await page.locator('[data-feedback-sample]').scrollIntoViewIfNeeded();
		await expect(
			page.getByText('Give these elements more breathing room.', { exact: true })
		).toBeVisible();
		const pin = page.getByRole('button', { name: 'Edit note 1: 3 elements', exact: true });
		await pin.focus();
		await expect(page.locator('.feedback-member-highlight')).toHaveCount(3);
		expect(
			await page
				.locator('.feedback-composer, .feedback-group-members')
				.evaluateAll((nodes) => nodes.every((node) => node.scrollWidth <= node.clientWidth + 1))
		).toBe(true);
		await pin.press('Enter');
		await expect(
			page.getByRole('list', { name: 'Selected elements' }).getByRole('listitem')
		).toHaveCount(3);
		expect(errors).toEqual([]);
	});
}

test('box selection cancels on Escape and handles empty boxes without activating the sample', async ({
	page
}) => {
	const { demo, box } = await setup(page);
	await page.mouse.move(box.left, box.top);
	await page.mouse.down();
	await page.mouse.move(box.right, box.bottom, { steps: 5 });
	await expect(page.locator('.feedback-box')).toBeVisible();
	await page.keyboard.press('Escape');
	await page.mouse.up();
	await expect(page.locator('.feedback-box')).toHaveCount(0);
	await expect(page.getByRole('textbox', { name: 'What would you like to change?' })).toHaveCount(
		0
	);
	await page.getByRole('button', { name: 'Select element', exact: true }).click();
	const sample = await demo.locator('[data-feedback-sample]').boundingBox();
	await page.mouse.move(sample!.x + 10, sample!.y + 10);
	await page.mouse.down();
	await page.mouse.move(sample!.x + 22, sample!.y + 22, { steps: 3 });
	await page.mouse.up();
	await expect(
		page.getByText('No elements inside the box. Drag around the whole element to include it.')
	).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'What would you like to change?' })).toHaveCount(
		0
	);
	await page.getByRole('button', { name: 'Explore the studio', exact: true }).click();
	await expect(page.locator('.feedback-selection-summary')).toContainText('Explore the studio');
	await expect(
		demo.getByText('Try selecting the button without activating it.', { exact: true })
	).toBeVisible();
});

test('box selection excludes private and editable content and avoids duplicate descendants', async ({
	page
}) => {
	const { demo } = await setup(page);
	await demo.locator('[data-feedback-sample]').evaluate((sample) => {
		const fixture = document.createElement('div');
		fixture.dataset.boxFixture = '';
		fixture.style.cssText = 'position:relative;width:450px;height:240px;margin-top:30px';
		fixture.innerHTML =
			'<section data-feedback-id="group-parent" style="position:absolute;left:20px;top:20px;width:180px;height:70px">Public card <span>Nested text</span><span data-feedback-ignore>Private secret</span></section><h5 data-feedback-id="group-heading" style="position:absolute;left:230px;top:20px;width:170px;height:30px">Public heading</h5><div data-feedback-ignore style="position:absolute;left:230px;top:70px;width:170px;height:30px">Ignored secret</div><input value="Private input" style="position:absolute;left:20px;top:130px;width:180px;height:30px" />';
		sample.appendChild(fixture);
	});
	const fixture = demo.locator('[data-box-fixture]');
	await fixture.scrollIntoViewIfNeeded();
	const rect = await fixture.boundingBox();
	await page.mouse.move(rect!.x + 5, rect!.y + 5);
	await page.mouse.down();
	await page.mouse.move(rect!.x + 420, rect!.y + 180, { steps: 8 });
	await page.mouse.up();
	await expect(
		page.getByRole('list', { name: 'Selected elements' }).getByRole('listitem')
	).toHaveCount(2);
	await page
		.getByRole('textbox', { name: 'What would you like to change?' })
		.fill('Update both sections');
	await page.getByRole('button', { name: 'Add note', exact: true }).click();
	const raw = await page.evaluate(() => localStorage.getItem('bedrock:feedback-demo:v1')!);
	const members = JSON.parse(raw).annotations[0].target.elements;
	expect(members.map((member: { tag: string }) => member.tag)).toEqual(['section', 'h5']);
	expect(raw).toContain('Nested text');
	expect(raw).not.toMatch(/Private secret|Ignored secret|Private input/);
});

test('box selection reuses geometry between moves and refreshes after page changes', async ({
	page
}) => {
	const { demo, box } = await setup(page);
	await page.mouse.move(box.left, box.top);
	await page.mouse.down();
	await page.mouse.move(box.right, box.bottom, { steps: 5 });
	await expect(page.locator('.feedback-member-highlight')).toHaveCount(3);
	await page.evaluate(() => {
		const original = Element.prototype.getBoundingClientRect;
		let reads = 0;
		Element.prototype.getBoundingClientRect = function () {
			if (this.closest('[data-feedback-sample]')) reads++;
			return original.call(this);
		};
		Object.assign(window, {
			feedbackGeometryProbe: {
				reads: () => reads,
				reset: () => {
					reads = 0;
				},
				restore: () => {
					Element.prototype.getBoundingClientRect = original;
				}
			}
		});
	});
	await page.mouse.move(box.right + 3, box.bottom + 3, { steps: 8 });
	// Wait for the requested animation frame, not an arbitrary elapsed-time budget.
	await expect
		.poll(() =>
			page
				.locator('.feedback-box')
				.evaluate((node) => parseFloat((node as HTMLElement).style.width))
		)
		.toBeCloseTo(box.right + 3 - box.left, 0);
	const reads = () =>
		page.evaluate(() =>
			(
				window as unknown as { feedbackGeometryProbe: { reads: () => number } }
			).feedbackGeometryProbe.reads()
		);
	expect(await reads()).toBe(0);
	await demo
		.locator('[data-feedback-id="feedback-demo-button"]')
		.evaluate((node) => node.setAttribute('data-feedback-ignore', ''));
	await expect(page.locator('.feedback-member-highlight')).toHaveCount(2);
	expect(await reads()).toBeGreaterThan(0);
	await page.evaluate(() =>
		(
			window as unknown as { feedbackGeometryProbe: { reset: () => void } }
		).feedbackGeometryProbe.reset()
	);
	await page.mouse.up();
	await expect(
		page.getByRole('list', { name: 'Selected elements' }).getByRole('listitem')
	).toHaveCount(2);
	expect(await reads()).toBeGreaterThan(0);
	await page.evaluate(() =>
		(
			window as unknown as { feedbackGeometryProbe: { restore: () => void } }
		).feedbackGeometryProbe.restore()
	);
});

test('hovering does not repeatedly resolve saved markers, while page mutations still update them', async ({
	page
}) => {
	const { demo } = await setup(page);
	await demo.locator('[data-feedback-id="feedback-demo-title"]').click();
	await page
		.getByRole('textbox', { name: 'What would you like to change?' })
		.fill('Saved title note');
	await page.getByRole('button', { name: 'Add note', exact: true }).click();
	await expect(page.locator('.feedback-pin')).toHaveCount(1);
	await demo.locator('h4 + p').hover();
	await expect(page.locator('.feedback-highlight-label')).toContainText('paragraph:');
	await page.evaluate(() => {
		const original = document.querySelectorAll.bind(document);
		let queries = 0;
		document.querySelectorAll = ((selector: string) => {
			if (selector === '[data-feedback-id="feedback-demo-title"]') queries++;
			return original(selector);
		}) as typeof document.querySelectorAll;
		Object.assign(window, {
			feedbackQueryProbe: {
				reads: () => queries,
				restore: () => {
					document.querySelectorAll = original;
				}
			}
		});
	});
	await demo.getByRole('button', { name: 'Explore the studio' }).hover();
	await expect(page.locator('.feedback-highlight-label')).toContainText('button:');
	await demo.locator('h4 + p').hover();
	await expect(page.locator('.feedback-highlight-label')).toContainText('paragraph:');
	const reads = () =>
		page.evaluate(() =>
			(
				window as unknown as { feedbackQueryProbe: { reads: () => number } }
			).feedbackQueryProbe.reads()
		);
	expect(await reads()).toBe(0);
	await demo.locator('[data-feedback-id="feedback-demo-title"]').evaluate((node) => node.remove());
	await expect.poll(reads).toBeGreaterThan(0);
	await page.keyboard.press('Escape');
	await expect(page.locator('.feedback-pin')).toHaveCount(0);
	await page.evaluate(() =>
		(
			window as unknown as { feedbackQueryProbe: { restore: () => void } }
		).feedbackQueryProbe.restore()
	);
});
