import { expect, test, type Page } from '@playwright/test';

const sceneTitles = [
	'Shared pill',
	'Pack and shuffle',
	'Layout beyond CSS',
	'Size',
	'Accordion',
	'Stack',
	'Search morph',
	'Row mark',
	'Card to stage',
	'Density',
	'Wrap',
	'Rail',
	'Content swap',
	'Validation'
];

async function waitForMotionToSettle(page: Page) {
	await page.waitForFunction(() => document.getAnimations().length === 0);
}

test('the motion lab exposes all fourteen scenes and representative interactions', async ({
	page
}) => {
	const consoleErrors: string[] = [];
	const consoleWarnings: string[] = [];
	const failedRequests: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') consoleErrors.push(message.text());
		if (message.type() === 'warning') consoleWarnings.push(message.text());
	});
	page.on('requestfailed', (request) => failedRequests.push(request.url()));

	await page.goto('/demo/ui');
	const scenes = page.locator('main > section');
	await expect(scenes).toHaveCount(14);
	await expect(scenes.locator('h2')).toHaveText(sceneTitles);

	const pillScene = scenes.filter({ has: page.getByRole('heading', { name: 'Shared pill' }) });
	await pillScene.getByRole('button', { name: 'Airborne' }).click();
	await pillScene.getByRole('button', { name: 'Boarding' }).click();
	await pillScene.getByRole('button', { name: 'Taxi' }).click();

	const packingScene = scenes.filter({
		has: page.getByRole('heading', { name: 'Pack and shuffle' })
	});
	await packingScene.getByRole('button', { name: 'north' }).click();
	await expect(packingScene.locator('article')).toHaveCount(2);

	const searchScene = scenes.filter({ has: page.getByRole('heading', { name: 'Search morph' }) });
	await searchScene.getByRole('button', { name: 'Open search' }).click();
	await expect(searchScene.getByPlaceholder('Stand, gate, or flight')).toBeVisible();

	const accordionScene = scenes.filter({ has: page.getByRole('heading', { name: 'Accordion' }) });
	await accordionScene.getByRole('button', { name: 'When do I need a shared id?' }).click();
	await expect(
		accordionScene.getByText('When the moving piece is a different DOM node')
	).toBeVisible();

	const validationScene = scenes.filter({ has: page.getByRole('heading', { name: 'Validation' }) });
	await validationScene.getByRole('button', { name: 'File plan' }).click();
	await expect(validationScene.getByRole('alert')).toHaveText('Enter a callsign before filing.');

	const swapScene = scenes.filter({ has: page.getByRole('heading', { name: 'Content swap' }) });
	const upload = swapScene.getByRole('button', { name: 'Upload manifest' });
	await upload.focus();
	await upload.click();
	await expect(upload).toBeFocused();
	await expect(upload).toHaveAttribute('aria-disabled', 'true');
	await page.waitForTimeout(1_900);
	await expect(upload).toBeFocused();

	await waitForMotionToSettle(page);
	expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
	expect(consoleErrors).toEqual([]);
	expect(consoleWarnings).toEqual([]);
	expect(failedRequests).toEqual([]);
});

function scene(page: Page, title: string) {
	return page
		.locator('main > section')
		.filter({ has: page.getByRole('heading', { name: title, exact: true }) });
}

test('projection preserves card identity through reorder and density changes', async ({ page }) => {
	await page.goto('/demo/ui');
	const pack = scene(page, 'Pack and shuffle');
	await pack
		.locator('article')
		.first()
		.evaluate((node) => node.setAttribute('data-preserved', 'true'));
	await pack.getByRole('button', { name: 'Shuffle' }).click();
	await expect(pack.locator('[data-preserved]')).toHaveCount(1);
	const density = scene(page, 'Density');
	const shell = page.locator('#motion-density-shell');
	const before = await shell.boundingBox();
	await density.getByRole('button', { name: 'Dense grid' }).click();
	await expect
		.poll(async () => (await shell.boundingBox())!.height)
		.toBeLessThan(before!.height - 10);
	await expect(density.locator('article')).toHaveCount(6);
	await density.getByRole('button', { name: 'Open grid' }).click();
	await expect
		.poll(async () => Math.abs((await shell.boundingBox())!.height - before!.height))
		.toBeLessThan(1);
});

test('shared card details restore keyboard focus and isolate background controls', async ({
	page
}) => {
	await page.goto('/demo/ui');
	const card = page.locator('#motion-feature-card-kef');
	await card.focus();
	await page.keyboard.press('Enter');
	const stage = page.locator('#motion-feature-stage');
	await expect(stage).toBeFocused();
	await expect(scene(page, 'Card to stage').locator('[inert]')).toHaveCount(1);
	await page.keyboard.press('Enter');
	await expect(stage).toHaveCount(0);
	await expect(card).toBeFocused();
});

test('CSS presence and projection keep notices, procedures and rail operable', async ({ page }) => {
	await page.goto('/demo/ui');
	const stack = scene(page, 'Stack');
	await stack.getByRole('button', { name: 'Post notice' }).click();
	await stack.getByRole('button', { name: 'Post notice' }).click();
	await expect(stack.getByRole('log').locator('article')).toHaveCount(2);
	await stack.getByRole('log').getByRole('button').first().click();
	await expect(stack.getByRole('log').locator('article')).toHaveCount(1);
	const wrap = scene(page, 'Wrap');
	await wrap.getByRole('button', { name: 'VFR', exact: true }).click();
	await expect(wrap.getByRole('button', { name: 'VFR', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	const rail = scene(page, 'Rail');
	await rail.getByRole('button', { name: 'Stow rail' }).click();
	await expect(rail.getByRole('complementary')).toHaveCount(0);
	await rail.getByRole('button', { name: 'Show rail' }).click();
	await expect(rail.getByRole('complementary')).toBeVisible();
});

test('reduced motion keeps every result accessible without lingering finite animations', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/demo/ui');
	await scene(page, 'Pack and shuffle').getByRole('button', { name: 'north' }).click();
	await expect(scene(page, 'Pack and shuffle').locator('article')).toHaveCount(2);
	await scene(page, 'Search morph').getByRole('button', { name: 'Open search' }).click();
	await expect(page.getByPlaceholder('Stand, gate, or flight')).toBeVisible();
	await scene(page, 'Validation').getByRole('button', { name: 'File plan' }).click();
	await expect(page.getByRole('alert')).toBeVisible();
	await expect
		.poll(() =>
			page.evaluate(
				() =>
					document.getAnimations().filter((animation) => animation.playState === 'running').length
			)
		)
		.toBe(0);
});

test('Astra stress route retains 100 nodes and selection when interrupted', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/demo/motion-test');
	await page.getByLabel('Participants').selectOption('100');
	const grid = page.getByTestId('stress-grid');
	await expect(grid.getByRole('button')).toHaveCount(100);
	await grid.getByRole('button', { name: 'Signal 5', exact: true }).click();
	await page.getByRole('button', { name: 'Reverse order' }).click();
	await page.getByRole('button', { name: 'Compact grid' }).click();
	await page.getByRole('button', { name: 'Reverse order' }).click();
	await expect(grid.getByRole('button', { name: 'Signal 5', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await expect(grid.getByRole('button').first()).toHaveText('Signal 1');
	await expect(page.getByRole('status')).toContainText('100 participants');
	expect(errors).toEqual([]);
});
