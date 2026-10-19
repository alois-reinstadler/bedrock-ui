import { test, expect, type Page } from '../../../scripts/shared-browser-test';

const examples = [
	['music-player', 'Music Player'],
	['video-library', 'Video Library'],
	['email-client', 'Email Client'],
	['social-network', 'Social Network']
] as const;

for (const width of [320, 1440]) {
	test(`feedback contains long content and identifies the selected element at ${width}px`, async ({
		page
	}) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.goto('/templates/music-player?feedback=developer');
		await expect(page.getByRole('button', { name: 'Close feedback' })).toBeVisible();
		const target = page.locator('[data-template-content] h1').first();
		await target.evaluate((node) => {
			node.setAttribute('aria-label', 'Long selected element label '.repeat(10));
			node.setAttribute('data-feedback-id', 'long-target-'.repeat(25));
			node.setAttribute('tabindex', '0');
		});
		await page.getByRole('button', { name: 'Select element', exact: true }).click();
		await target.focus();
		await page.keyboard.press('Enter');
		await expect(page.locator('.feedback-selection-summary')).toContainText('h1:');
		await expect(page.locator('.feedback-composer')).toBeVisible();
		const input = page.getByRole('textbox', { name: 'What would you like to change?' });
		await input.fill('LongUnbrokenFeedback'.repeat(50));
		await expect(page.locator('.feedback-highlight')).toBeVisible();
		const targetBox = await target.boundingBox();
		const outlineBox = await page.locator('.feedback-highlight').boundingBox();
		expect(outlineBox!.x).toBeCloseTo(targetBox!.x, 0);
		expect(outlineBox!.width).toBeCloseTo(targetBox!.width, 0);
		async function expectNoOverflow() {
			const sizes = await page
				.locator(
					'.feedback-panel, .feedback-body, .feedback-notes, .feedback-notes li, .feedback-selection-summary'
				)
				.evaluateAll((nodes) => nodes.map((node) => node.scrollWidth - node.clientWidth));
			expect(
				sizes.every((overflow) => overflow <= 1),
				JSON.stringify(sizes)
			).toBe(true);
			const panel = await page.locator('.feedback-panel, .feedback-toolbar').first().boundingBox();
			expect(panel!.x).toBeGreaterThanOrEqual(0);
			expect(panel!.x + panel!.width).toBeLessThanOrEqual(width);
		}
		await expectNoOverflow();
		await page.getByRole('button', { name: 'Add note', exact: true }).click();
		await expectNoOverflow();
		const pin = page.locator('.feedback-pin');
		await expect(pin).toHaveText('1');
		await pin.focus();
		await expect(page.locator('.feedback-highlight-label')).toContainText(
			'Long selected element label'
		);
		await pin.press('Enter');
		await expect(page.locator('.feedback-composer')).toBeVisible();
		await expect(input).toHaveValue('LongUnbrokenFeedback'.repeat(50));
		await page.getByRole('button', { name: 'Cancel', exact: true }).click();
		await page.getByRole('button', { name: 'Page note', exact: true }).click();
		await expect(page.locator('.feedback-highlight')).toHaveCount(0);
		await expect(page.locator('.feedback-selection-summary')).toContainText('Whole page');
	});
}

async function writeNote(page: Page, comment: string) {
	await page.getByRole('textbox', { name: 'What would you like to change?' }).fill(comment);
	await page.getByRole('button', { name: 'Add note', exact: true }).click();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
}

async function chooseMode(page: Page, name: string) {
	await page.getByRole('button', { name: 'Close feedback', exact: true }).click();
	await page.getByRole('button', { name: 'Feedback options', exact: true }).click();
	await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
}

for (const [slug, title] of examples) {
	test(`${title}: developer annotations and customer reviews have separate drafts`, async ({
		page
	}) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.goto(`/templates/${slug}?feedback=developer`);
		await expect(page.locator('[data-feedback-ui]')).toHaveCount(1);
		await expect(page.getByRole('group', { name: 'Feedback 0', exact: true })).toBeVisible();
		await expect(page.locator('.feedback-launcher')).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Close feedback' })).toBeFocused();
		await page.getByRole('button', { name: 'Select element', exact: true }).click();
		await page.locator('[data-template-content] h1:visible').first().click();
		await writeNote(page, `Developer change for ${title}`);
		const payload = await page.evaluate(
			(key) => JSON.parse(localStorage.getItem(key)!),
			`bedrock:template-feedback:${slug}:developer:v1`
		);
		expect(payload.project).toBe(`${title} template`);
		expect(payload.annotations[0].target.styles).toHaveProperty('font-size');
		expect(payload.annotations[0].page).not.toContain('?feedback=');
		await chooseMode(page, 'Customer review');
		await expect(page.getByRole('group', { name: 'Your feedback 0', exact: true })).toBeVisible();
		await expect(page.getByText(`Developer change for ${title}`, { exact: true })).toHaveCount(0);
		await page.getByRole('button', { name: 'Page note', exact: true }).click();
		await writeNote(page, `Customer change for ${title}`);
		await chooseMode(page, 'Developer annotations');
		await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
		await expect(page.getByText(`Developer change for ${title}`, { exact: true })).toBeVisible();
		await expect(page.getByText(`Customer change for ${title}`, { exact: true })).toHaveCount(0);
		await page.reload();
		await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
		await expect(page.getByText(`Developer change for ${title}`, { exact: true })).toBeVisible();
		await page.getByRole('button', { name: 'Close feedback' }).click();
		await expect(
			page.getByRole('button', { name: 'Template feedback', exact: true })
		).toBeFocused();
		expect(errors).toEqual([]);
	});
}

test('template navigation retains mode, separates projects and restores earlier drafts', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/templates/music-player?feedback=developer');
	await page.getByRole('button', { name: 'Page note', exact: true }).click();
	await writeNote(page, 'Music home note');
	await page.getByRole('button', { name: 'Close feedback' }).click();
	await page
		.getByRole('navigation', { name: 'Music navigation' })
		.getByRole('link', { name: 'Your library', exact: true })
		.click();
	await page.getByRole('button', { name: 'Template feedback', exact: true }).click();
	await expect(page.getByRole('group', { name: 'Feedback 0', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
	await expect(
		page.getByText('1 note across all pages · Browser drafts', { exact: true })
	).toBeVisible();
	await page.getByRole('button', { name: 'Close feedback' }).click();
	await page.reload();
	await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
		'data-ready',
		'true'
	);
	await page.getByRole('button', { name: 'Template feedback', exact: true }).click();
	await expect(page.getByRole('group', { name: 'Feedback 0', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Close feedback' }).click();
	await page.getByRole('button', { name: 'Switch template' }).click();
	await page
		.getByRole('navigation', { name: 'Live templates' })
		.getByRole('link', { name: 'Social Network', exact: true })
		.click();
	await page.getByRole('button', { name: 'Template feedback', exact: true }).click();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
	await expect(
		page.getByText('0 notes across all pages · Browser drafts', { exact: true })
	).toBeVisible();
	await page.getByRole('button', { name: 'Close feedback' }).click();
	await page.getByRole('button', { name: 'Switch template' }).click();
	await page
		.getByRole('navigation', { name: 'Live templates' })
		.getByRole('link', { name: 'Music Player', exact: true })
		.click();
	await page.getByRole('button', { name: 'Template feedback', exact: true }).click();
	await page.getByRole('button', { name: 'Preview notes', exact: true }).click();
	await expect(page.getByText('Music home note', { exact: true })).toBeVisible();
});

test('gallery entry points expose both modes for every template', async ({ page }) => {
	await page.goto('/docs/templates');
	for (const [slug, title] of examples) {
		await expect(page.getByRole('link', { name: `Review ${title}`, exact: true })).toHaveAttribute(
			'href',
			`/templates/${slug}?feedback=review`
		);
		await expect(
			page.getByRole('link', { name: `Annotate ${title}`, exact: true })
		).toHaveAttribute('href', `/templates/${slug}?feedback=developer`);
	}
});

test('mobile feedback controls fit every template and remain reachable when minimized', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	for (const [slug] of examples) {
		await page.goto(`/templates/${slug}?feedback=review`);
		await expect(page.getByRole('group', { name: 'Your feedback 0', exact: true })).toBeVisible();
		const panel = await page.locator('.feedback-toolbar').boundingBox();
		expect(panel!.x).toBeGreaterThanOrEqual(0);
		expect(panel!.x + panel!.width).toBeLessThanOrEqual(390);
		expect(panel!.y).toBeGreaterThanOrEqual(0);
		await page.getByRole('button', { name: 'Close feedback' }).click();
		const controls = page.getByRole('region', { name: 'Template preview controls' });
		const dock = await controls.boundingBox();
		expect(dock!.x + dock!.width).toBeLessThanOrEqual(390);
		await page.getByRole('button', { name: 'Minimize preview controls' }).click();
		await page.getByRole('button', { name: 'Template feedback', exact: true }).click();
		await expect(page.getByRole('group', { name: 'Your feedback 0', exact: true })).toBeVisible();
		await page.getByRole('button', { name: 'Close feedback' }).click();
		await page.getByRole('button', { name: 'Feedback options' }).click();
		await page.getByRole('button', { name: 'Turn feedback off', exact: true }).click();
		await expect(page.locator('[data-feedback-ui]')).toHaveCount(0);
		await page.getByRole('button', { name: 'Show preview controls' }).click();
	}
});
