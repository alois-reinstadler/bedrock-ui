import { test, expect, type Page } from '../../../scripts/shared-browser-test';

async function setup(page: Page, mode = 'review') {
	await page.setViewportSize({ width: 1440, height: 1100 });
	await page.goto('/docs/tools/page-annotations');
	const sample = page.locator('[data-feedback-sample]');
	await expect(sample).toBeVisible({ timeout: 15000 });
	await sample.scrollIntoViewIfNeeded();
	await page
		.locator('select')
		.filter({ has: page.locator('option[value="review"]') })
		.selectOption(mode);
	await page.getByRole('button', { name: 'Review this sample' }).click();
	await page.getByRole('button', { name: 'Select element', exact: true }).click();
	return sample;
}

test('customer edits page text directly, saves a suggestion and reloads its before/after copy', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	const sample = await setup(page);
	const heading = sample.locator('h4');
	const before = await heading.textContent();
	await heading.click();
	await page.getByRole('button', { name: 'Edit text on page', exact: true }).click();
	await expect(heading).toHaveAttribute('contenteditable', 'plaintext-only');
	await expect(heading).toBeFocused();
	await heading.pressSequentially('A better place to make great work.');
	await expect(page.locator('.feedback-copy-preview ins')).toHaveText(
		'A better place to make great work.'
	);
	await heading.press('Enter');
	await expect(page.locator('.feedback-composer')).toHaveCount(0);
	await expect(heading).not.toHaveAttribute('contenteditable');
	expect(await heading.textContent()).toBe(before);
	const payload = await page.evaluate(() =>
		JSON.parse(localStorage.getItem('bedrock:feedback-demo:v1')!)
	);
	expect(payload.annotations[0].textChange).toEqual({
		before,
		after: 'A better place to make great work.'
	});
	expect(payload.annotations[0].comment).toBe('');
	await page.reload();
	await page.getByRole('button', { name: 'Review this sample' }).click();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
	await expect(page.locator('.feedback-notes ins')).toHaveText(
		'A better place to make great work.'
	);
	await page.getByRole('button', { name: 'Edit: Text suggestion' }).click();
	await expect(page.locator('.feedback-copy-preview ins')).toHaveText(
		'A better place to make great work.'
	);
	await page.getByRole('button', { name: 'Edit text on page', exact: true }).click();
	await heading.fill('Another proposal');
	await page.getByRole('button', { name: 'Undo text edit' }).click();
	expect(await heading.textContent()).toBe(before);
	await page.getByRole('button', { name: 'Cancel', exact: true }).click();
	expect(errors).toEqual([]);
});

test('cancel and close restore the original nodes and editing a button never activates it', async ({
	page
}) => {
	const sample = await setup(page);
	const button = sample.getByRole('button', { name: 'Explore the studio', exact: true });
	await button.evaluate((element) => {
		Object.assign(window, { originalFeedbackNodes: [...element.childNodes] });
	});
	await button.click();
	await page.getByRole('button', { name: 'Edit text on page', exact: true }).click();
	await button.fill('Book a tour');
	await sample.locator('[data-feedback-id="feedback-demo-button"]').click();
	await expect(
		sample.getByText('Try selecting the button without activating it.', { exact: true })
	).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(button).toBeVisible();
	expect(
		await button.evaluate((element) =>
			[...element.childNodes].every(
				(node, index) =>
					node ===
					(window as unknown as { originalFeedbackNodes: Node[] }).originalFeedbackNodes[index]
			)
		)
	).toBe(true);
	await button.click();
	await page.getByRole('button', { name: 'Edit text on page', exact: true }).click();
	await button.fill('Unsaved edit');
	await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
	await expect(button).not.toHaveAttribute('contenteditable');
	await expect(button).toBeVisible();
});

test('application changes win over an inline preview and developer mode keeps text read-only', async ({
	page
}) => {
	const sample = await setup(page);
	const heading = sample.locator('h4');
	await heading.evaluate((element) => {
		Object.assign(window, {
			originalFeedbackText: [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE)
		});
	});
	await heading.click();
	await page.getByRole('button', { name: 'Edit text on page', exact: true }).click();
	await heading.fill('A local suggestion');
	await page.evaluate(() => {
		(window as unknown as { originalFeedbackText: Text }).originalFeedbackText.data =
			'Updated by the application';
	});
	await expect(heading).toHaveText('Updated by the application');
	await expect(heading).not.toHaveAttribute('contenteditable');
	await expect(page.locator('.feedback-composer')).toHaveCount(0);
	await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
	await page
		.locator('select')
		.filter({ has: page.locator('option[value="review"]') })
		.selectOption('developer');
	await page.getByRole('button', { name: 'Review this sample' }).click();
	await page.getByRole('button', { name: 'Select element', exact: true }).click();
	await heading.click();
	await expect(page.getByRole('button', { name: 'Edit text on page', exact: true })).toHaveCount(0);
});

test('selection geometry interpolates and the composer animates intrinsic size changes', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	const sample = await setup(page, 'developer');
	await sample.locator('h4').hover();
	await expect(page.locator('.feedback-highlight-label')).toContainText('heading:');
	const motion = await sample.locator('h4 + p').evaluate(async (element) => {
		const rect = element.getBoundingClientRect();
		element.dispatchEvent(
			new PointerEvent('pointermove', { bubbles: true, clientX: rect.x + 10, clientY: rect.y + 10 })
		);
		await new Promise<void>((resolve) =>
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
		);
		const outline = document.querySelector('.feedback-highlight')!;
		return {
			width: outline.getBoundingClientRect().width,
			destination: rect.width,
			animating: outline
				.getAnimations()
				.some((animation) =>
					(animation.effect as KeyframeEffect)
						.getKeyframes()
						.some((frame) => frame.width !== undefined)
				)
		};
	});
	expect(motion.animating).toBe(true);
	expect(motion.width).toBeLessThan(motion.destination);
	await sample.locator('h4').click();
	const resizing = await page.locator('.feedback-context').evaluate(async (element) => {
		(element as HTMLDetailsElement).open = true;
		await new Promise<void>((resolve) =>
			requestAnimationFrame(() =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
			)
		);
		return document
			.querySelector('.feedback-composer')!
			.getAnimations()
			.some((animation) =>
				(animation.effect as KeyframeEffect)
					.getKeyframes()
					.some((frame) => frame.height !== undefined)
			);
	});
	expect(resizing).toBe(true);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect
		.poll(() =>
			page
				.locator('.feedback-composer')
				.evaluate((node) => node.getAnimations().filter((a) => a.playState === 'running').length)
		)
		.toBe(0);
});
