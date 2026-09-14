import { expect, test } from '@playwright/test';

test('documentation navigation searches every artifact and preserves its reload boundary', async ({
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
	await expect(result).toHaveAttribute('data-sveltekit-reload', /^(true)?$/);
	await result.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('[data-doc-slug="authentication-panel"]')).toBeVisible();
	await page.getByRole('link', { name: 'Properties', exact: true }).click();
	await page.reload();
	await expect(page.locator('[data-doc-tab="properties"]')).toBeVisible();
	await expect(page.getByRole('cell', { name: 'onSubmit', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Changelog', exact: true })).toHaveCount(0);
});

test('blocks provide working collection filters and failed submission retry', async ({ page }) => {
	await page.goto('/docs/blocks/data-toolbar');
	await page.waitForLoadState('networkidle');
	await page.getByRole('searchbox', { name: 'Search collection' }).fill('customer');
	await expect(page.getByRole('status').filter({ hasText: /1\s+result/ })).toBeVisible();
	await page.getByRole('button', { name: 'Active only' }).click();
	await expect(page.getByRole('status').filter({ hasText: /0\s+results/ })).toBeVisible();
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
