import { expect, test } from '@playwright/test';

test.describe('Social Network template', () => {
	test('publishes a note and supports feed reactions and threads', async ({ page }) => {
		const pageErrors: string[] = [];
		page.on('pageerror', (error) => pageErrors.push(error.message));

		await page.goto('/templates/social-network');
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your corner of the internet');

		const composer = page.getByPlaceholder('Share something worth keeping…');
		await composer.fill('A calmer interface leaves room for better decisions.');
		await page.getByRole('button', { name: /Publish/ }).click();
		await expect(
			page.getByText('A calmer interface leaves room for better decisions.')
		).toBeVisible();

		const post = page.locator('[data-post-id="garden-signals"]');
		const appreciate = post.getByRole('button', { name: /appreciations/ });
		await appreciate.click();
		await expect(appreciate).toHaveAttribute('aria-pressed', 'true');

		const replies = post.getByRole('button', { name: /replies/ });
		await replies.click();
		await expect(post.getByText('The social layer is the real infrastructure.')).toBeVisible();
		expect(pageErrors).toEqual([]);
	});

	test('adapts its primary controls to a mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/templates/social-network');

		const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
		await expect(mobileNav).toBeVisible();
		await mobileNav.getByRole('button', { name: 'Updates' }).click();
		await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
		await expect(page.getByText('2 updates waiting for you')).toBeVisible();
	});
});

test('searches, saves, replies, opens profiles, and marks notifications read', async ({ page }) => {
	await page.goto('/templates/social-network');
	const search = page.getByRole('textbox', { name: 'Search people and notes' });
	await search.fill('not-a-real-note');
	await expect(page.getByRole('status').filter({ hasText: 'No notes here yet' })).toBeVisible();
	await search.fill('shade');
	await expect(page.locator('[data-post-id]')).toHaveCount(1);
	await search.clear();
	const post = page.locator('[data-post-id="garden-signals"]');
	await post.getByRole('button', { name: 'Save note', exact: true }).click();
	await post.getByRole('button', { name: /replies/ }).click();
	await post
		.getByRole('textbox', { name: 'Reply to Sora Bell' })
		.fill('Rest belongs in every neighborhood.');
	await post.getByRole('button', { name: 'Send reply' }).click();
	await expect(post.getByText('Rest belongs in every neighborhood.')).toBeVisible();
	await post.getByRole('button', { name: "Open Sora Bell's profile" }).click();
	await expect(page.getByRole('dialog').getByRole('heading', { name: 'Sora Bell' })).toBeVisible();
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Open notifications', exact: true }).click();
	await page
		.getByRole('dialog')
		.getByRole('button', { name: /Eli Moreno/ })
		.click();
	await expect(page.getByText('1 update waiting for you')).toBeVisible();
});
