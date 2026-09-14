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

test('retains drafts, publishes described media, and supports reversible moderation', async ({
	page
}) => {
	await page.goto('/templates/social-network');
	const draft = page.getByRole('textbox', { name: 'Write a new note' });
	await draft.fill('A garden gives a neighborhood room to pause.');
	await page.reload();
	await expect(draft).toHaveValue('A garden gives a neighborhood room to pause.');
	await page.getByRole('button', { name: 'Attach sample field map' }).click();
	await page
		.getByRole('textbox', { name: 'Image description' })
		.fill('Three shaded gathering places connected by garden paths');
	await page.getByRole('button', { name: 'Publish', exact: true }).click();
	const post = page.locator('[data-post-id]').first();
	await expect(
		post.getByRole('img', { name: 'Three shaded gathering places connected by garden paths' })
	).toBeVisible();
	await post.getByRole('button', { name: 'Save note', exact: true }).click();
	await page
		.getByRole('navigation', { name: 'Social primary navigation', exact: true })
		.getByRole('button', { name: 'Saved', exact: true })
		.click();
	await expect(page).toHaveURL(/view=Saved/);
	await expect(page.getByText('A garden gives a neighborhood room to pause.')).toBeVisible();
	await page
		.locator('[data-post-id]')
		.first()
		.getByRole('button', { name: 'Hide note by Mina Okafor' })
		.click();
	await expect(page.getByText('A garden gives a neighborhood room to pause.')).toHaveCount(0);
	await page.getByRole('button', { name: 'Undo hide' }).click();
	await expect(page.getByText('A garden gives a neighborhood room to pause.')).toBeVisible();
});

test('links profiles and threads, edits own profile, and filters notifications', async ({
	page
}) => {
	await page.goto('/templates/social-network?view=Profile');
	await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
	await page.getByRole('textbox', { name: 'Display name' }).fill('Mina Fieldwork');
	await page.getByRole('textbox', { name: 'About you' }).fill('Making more room for useful ideas.');
	await page.getByRole('button', { name: 'Save profile' }).click();
	await expect(
		page
			.getByRole('region', { name: 'Your profile' })
			.getByRole('heading', { name: 'Mina Fieldwork' })
	).toBeVisible();
	await page.goto('/templates/social-network?thread=garden-signals');
	await expect(page.getByRole('textbox', { name: 'Reply to Sora Bell' })).toBeVisible();
	await page.reload();
	await expect(page.getByRole('textbox', { name: 'Reply to Sora Bell' })).toBeVisible();
	await page
		.locator('[data-post-id="garden-signals"]')
		.getByRole('button', { name: "Open Sora Bell's profile" })
		.click();
	await expect(page).toHaveURL(/profile=sora/);
	await page.reload();
	await expect(page.getByRole('dialog').getByRole('heading', { name: 'Sora Bell' })).toBeVisible();
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Open notifications', exact: true }).click();
	await page.getByRole('button', { name: 'Unread only' }).click();
	await page.getByRole('button', { name: 'Mark all read' }).click();
	await expect(page.getByText('0 updates waiting for you')).toBeVisible();
});

test('mobile discovery and browser history work with reduced motion', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
	await page.goto('/templates/social-network');
	const navigation = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
	await navigation.getByRole('button', { name: 'Discover', exact: true }).click();
	await expect(
		page.getByRole('heading', { name: 'Small circles. Wider perspectives.' })
	).toBeVisible();
	await page
		.getByRole('region', { name: 'Explore circles' })
		.getByRole('button', { name: 'Follow', exact: true })
		.first()
		.click();
	await navigation.getByRole('button', { name: 'Profile', exact: true }).click();
	await expect(page.getByRole('region', { name: 'Your profile' })).toBeVisible();
	await page.goBack();
	await expect(page).toHaveURL(/view=Discover/);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
});
