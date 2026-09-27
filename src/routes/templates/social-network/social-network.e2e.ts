import { expect, test } from '@playwright/test';

const base = '/templates/social-network';

test('opens on the feed, publishes, likes, reposts, quotes and bookmarks', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto(base);
	await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
		'data-ready',
		'true'
	);
	await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
	await expect(page.getByText('Find your people', { exact: true })).toHaveCount(0);
	await page
		.getByRole('textbox', { name: 'Write a post', exact: true })
		.fill('A little more room for real conversation.');
	await page.getByRole('button', { name: 'Post', exact: true }).click();
	await expect(page.locator('[data-post-id]').first()).toContainText(
		'A little more room for real conversation.'
	);
	const post = page.locator('[data-post-id="long-way-home"]');
	await post.getByRole('button', { name: "Like Leo Martin's post" }).click();
	await expect(post.getByRole('button', { name: "Like Leo Martin's post" })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await post.getByRole('button', { name: "Repost Leo Martin's post" }).click();
	await expect(post.getByText('You reposted')).toBeVisible();
	await post.getByRole('button', { name: 'Bookmark post', exact: true }).click();
	await post.getByRole('button', { name: "Quote Leo Martin's post" }).click();
	await post.getByRole('textbox', { name: 'Write a quote' }).fill('Worth taking the scenic route.');
	await post.getByRole('button', { name: 'Post', exact: true }).click();
	await expect(page.locator('[data-post-id]').first()).toContainText(
		'Worth taking the scenic route.'
	);
	await page
		.getByRole('navigation', { name: 'Social primary navigation', exact: true })
		.getByRole('link', { name: 'Bookmarks' })
		.click();
	await expect(page).toHaveURL(`${base}/bookmarks`);
	await expect(page.locator('[data-post-id="long-way-home"]')).toBeVisible();
	await expect(
		page
			.locator('[data-post-id="long-way-home"]')
			.getByRole('button', { name: "Like Leo Martin's post" })
	).toHaveAttribute('aria-pressed', 'true');
	expect(errors).toEqual([]);
});

test('thread and profile routes survive refresh; replies and account dropdown work', async ({
	page
}) => {
	await page.goto(`${base}/post/long-way-home`);
	await expect(page.getByRole('heading', { name: 'Post', exact: true })).toBeVisible();
	await page.reload();
	await page.getByRole('textbox', { name: 'Write a reply' }).fill('Taking the long way tomorrow.');
	await page.getByRole('button', { name: 'Reply', exact: true }).click();
	await expect(page.getByText('Taking the long way tomorrow.')).toBeVisible();
	await page
		.locator('[data-post-id="long-way-home"]')
		.getByRole('link', { name: 'Leo Martin profile' })
		.click();
	await expect(page).toHaveURL(`${base}/profile/leo`);
	await page.reload();
	await expect(
		page.getByRole('region', { name: 'Profile' }).getByRole('heading', { name: 'Leo Martin' })
	).toBeVisible();
	await page.getByRole('button', { name: 'Open account menu' }).click();
	await page.getByRole('menuitem', { name: 'View your profile' }).click();
	await expect(page).toHaveURL(`${base}/profile/mina`);
	await page.getByRole('button', { name: 'Edit profile' }).click();
	await page.getByRole('textbox', { name: 'Display name' }).fill('Mina Studio');
	await page.getByRole('button', { name: 'Save profile' }).click();
	await expect(
		page.getByRole('region', { name: 'Profile' }).getByRole('heading', { name: 'Mina Studio' })
	).toBeVisible();
});

test('search uses a query, notifications use a route, and note feedback works', async ({
	page
}) => {
	await page.goto(`${base}/explore`);
	await page.getByRole('textbox', { name: 'Search posts and people' }).fill('photography');
	await page.getByRole('button', { name: 'Search', exact: true }).click();
	await expect(page).toHaveURL(/\/explore\?q=photography$/);
	await expect(page.locator('[data-post-id]')).toHaveCount(2);
	const note = page.locator('[data-post-id="city-after-dark"]');
	await note.getByRole('button', { name: 'Helpful?', exact: true }).click();
	await expect(note.getByRole('button', { name: 'Thanks for your feedback' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page
		.getByRole('navigation', { name: 'Social primary navigation', exact: true })
		.getByRole('link', { name: 'Notifications' })
		.click();
	await expect(page).toHaveURL(`${base}/notifications`);
	await page.getByRole('button', { name: 'Unread', exact: true }).click();
	await page.getByRole('button', { name: 'Mark all read' }).click();
	await expect(page.getByText('No unread notifications.')).toBeVisible();
});

test('mobile controls have padding, no horizontal overflow, and working route history', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto(base);
	await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
	const composer = page.getByRole('textbox', { name: 'Write a post', exact: true });
	expect(
		await composer.evaluate((element) => parseFloat(getComputedStyle(element).paddingLeft))
	).toBeGreaterThanOrEqual(8);
	await composer.fill('A draft stays with the app.');
	const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
	await navigation.getByRole('link', { name: 'Explore' }).click();
	await expect(page).toHaveURL(`${base}/explore`);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await navigation.getByRole('link', { name: 'Profile' }).click();
	await expect(page).toHaveURL(`${base}/profile/mina`);
	await page.goBack();
	await expect(page).toHaveURL(`${base}/explore`);
	await navigation.getByRole('link', { name: 'Home' }).click();
	await expect(composer).toHaveValue('A draft stays with the app.');
});

test('follow chips stay inside their rows and downloaded media loads', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto(base);
	const discovery = page.getByRole('complementary', { name: 'Discover people and topics' });
	await discovery.getByRole('button', { name: 'Follow Nora Chen', exact: true }).click();
	await expect(discovery.getByRole('button', { name: 'Unfollow Nora Chen' })).toHaveText(
		'Following'
	);
	const contained = await discovery.locator('.follow-row').evaluateAll((rows) =>
		rows.every((row) => {
			const outer = row.getBoundingClientRect();
			const button = row.querySelector('button')!.getBoundingClientRect();
			return button.right <= outer.right + 1 && button.left >= outer.left;
		})
	);
	expect(contained).toBe(true);
	await expect(page.locator('[data-post-id="long-way-home"] img.post-media')).toBeVisible();
	expect(
		await page
			.locator('[data-post-id="long-way-home"] img.post-media')
			.evaluate((image) => (image as HTMLImageElement).naturalWidth)
	).toBeGreaterThan(500);
	const video = page.locator('video').first();
	await video.scrollIntoViewIfNeeded();
	await expect
		.poll(() => video.evaluate((element) => (element as HTMLVideoElement).readyState))
		.toBeGreaterThan(0);
});
