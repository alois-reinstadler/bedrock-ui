import { expect, test } from '../../../scripts/shared-browser-test';

test('primary navigation does not overflow vertically while a link is pressed', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/docs');
	const navigation = page.getByRole('navigation', { name: 'Primary' });
	for (const title of ['Components', 'Blocks', 'Templates', 'Docs']) {
		const link = navigation.getByRole('link', { name: title, exact: true });
		const href = await link.getAttribute('href');
		await link.hover();
		await page.mouse.down();
		await expect(link).toHaveCSS('translate', '0px 1px');
		expect(await navigation.evaluate((node) => node.scrollHeight - node.clientHeight)).toBe(0);
		await page.mouse.up();
		await expect(page).toHaveURL(href!);
	}
});

test('documentation navigation searches every artifact and preserves the documentation shell', async ({
	page
}) => {
	await page.goto('/docs/blocks');
	await page.waitForLoadState('networkidle');
	await expect(
		page.getByRole('navigation', { name: 'Primary' }).locator('[aria-current="page"]')
	).toHaveText('Blocks');
	const search = page.getByRole('textbox', { name: 'Search documentation' });
	await search.fill('music');
	await expect(page.getByRole('link', { name: 'Music Player Template' })).toHaveAttribute(
		'href',
		'/templates/music-player'
	);
	await search.fill('zzmissing');
	await expect(page.getByText('No documentation found.')).toBeVisible();
	await search.fill('authentication');
	const result = page.getByRole('link', { name: 'Authentication Panel Block' });
	await expect(result).toHaveAttribute('data-sveltekit-reload', 'false');
	await result.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('[data-doc-slug="authentication-panel"]')).toBeVisible();
	await page.getByRole('link', { name: 'Properties', exact: true }).click();
	await expect(page).toHaveURL(/\?tab=properties$/);
	await expect(page.locator('[data-doc-tab="properties"]')).toBeVisible();
	await page.reload();
	await expect(page.locator('[data-doc-tab="properties"]')).toBeVisible();
	await expect(page.getByRole('rowheader', { name: /^onSubmit/ })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Changelog', exact: true })).toHaveCount(0);
});

test('authentication block provides failed submission retry', async ({ page }) => {
	await page.goto('/docs/blocks/authentication-panel');
	await page.waitForLoadState('networkidle');
	await page.getByRole('textbox', { name: 'Email', exact: true }).fill('test@example.com');
	await page.getByLabel('Password', { exact: true }).fill('fictional-password');
	await page.getByRole('switch', { name: 'Simulate a server error' }).click();
	await page.getByRole('button', { name: 'Sign in', exact: true }).click();
	await expect(page.getByRole('status').filter({ hasText: 'Sign-in failed' })).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveValue(
		'test@example.com'
	);
	await page.getByRole('switch', { name: 'Simulate a server error' }).click();
	await page.getByRole('button', { name: 'Try again' }).click();
	await expect(
		page.getByRole('status').filter({ hasText: 'Signed in successfully' })
	).toBeVisible();
});

test('mobile docs navigation opens accessibly without horizontal page overflow', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
	await page.goto('/docs');
	await page.waitForLoadState('networkidle');
	await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
	await expect(page.getByRole('textbox', { name: 'Search documentation' })).toBeVisible();
	await page.keyboard.press('Escape');
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
