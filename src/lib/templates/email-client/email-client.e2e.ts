import { expect, test } from '@playwright/test';

test('mail search, selection, archive, compose, and calendar work locally', async ({ page }) => {
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page.getByRole('textbox', { name: 'Search mail' }).fill('Research window');
	await expect(page.locator('.message-summary')).toHaveCount(1);
	await page.getByRole('textbox', { name: 'Search mail' }).fill('no matching message');
	await expect(page.getByText('No messages here')).toBeVisible();
	await page.getByRole('button', { name: 'Clear search' }).click();
	await page.locator('.message-summary').first().hover();
	await page.getByRole('checkbox', { name: 'Select message from June Park' }).check();
	await page.getByRole('button', { name: 'Archive selected', exact: true }).click();
	await expect(page.locator('.message-summary')).toHaveCount(4);
	await page
		.getByRole('button', { name: 'Compose', exact: false })
		.filter({ visible: true })
		.first()
		.click();
	await page.getByRole('textbox', { name: 'To', exact: true }).fill('friend@example.com');
	await page.getByRole('textbox', { name: 'Subject', exact: true }).fill('A local hello');
	await page
		.getByRole('textbox', { name: 'Message', exact: true })
		.fill('See you at the workshop.');
	await page.getByRole('button', { name: 'Send message', exact: true }).click();
	await page
		.getByRole('navigation', { name: 'Mailbox', exact: true })
		.getByRole('link', { name: 'Sent' })
		.click();
	await expect(page.locator('.message-summary').filter({ hasText: 'A local hello' })).toBeVisible();
	await page.getByRole('button', { name: 'Open calendar' }).first().click();
	await expect(page).toHaveURL(/\/calendar$/);
	await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
	await expect(
		page.getByRole('button', { name: 'Edit Launch readiness', exact: true })
	).toBeVisible();
});

test('mobile reading returns focus to the list and keeps layout within viewport', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page.locator('.message-summary').first().click();
	await expect(page.locator('#mail-reader-heading')).toBeFocused();
	await page.getByRole('button', { name: 'Back to messages' }).click();
	await expect(page.locator('#mail-list-heading')).toBeFocused();
	await page.getByRole('button', { name: 'Toggle mailboxes' }).click();
	await expect(page.getByRole('navigation', { name: 'Mailbox', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Toggle mailboxes' }).click();
	const workspace = await page.locator('.productivity-workspace').boundingBox();
	expect(workspace?.height).toBe(844);
	expect(workspace?.y).toBe(0);
	const overflows = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
	expect(overflows).toBe(false);
});

test('mobile standard motion focuses the opened message', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page.locator('.message-summary').first().click();
	await expect(page.locator('#mail-reader-heading')).toBeFocused();
});

test('calendar creates, validates, edits and deletes events with month navigation', async ({
	page
}) => {
	await page.goto('/templates/email-client/calendar');
	await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
		'data-ready',
		'true'
	);
	await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'New event', exact: true }).click();
	await page.getByRole('textbox', { name: 'Event title', exact: true }).fill('Customer workshop');
	await page.getByLabel('Start time', { exact: true }).fill('11:40');
	await page.getByLabel('End time', { exact: true }).fill('12:10');
	await page.getByRole('button', { name: 'Save event', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('overlaps with Launch readiness');
	await page.getByLabel('Start time', { exact: true }).fill('12:30');
	await page.getByLabel('End time', { exact: true }).fill('13:00');
	await page.getByRole('button', { name: 'Save event', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Customer workshop', exact: true })
	).toBeVisible();
	await page.getByRole('button', { name: 'Edit Customer workshop', exact: true }).click();
	await page
		.getByRole('textbox', { name: 'Event title', exact: true })
		.fill('Customer workshop revised');
	await page.getByRole('button', { name: 'Save event', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Customer workshop revised', exact: true })
	).toBeVisible();
	await page.locator('[data-productivity-screen="calendar"] [data-calendar-next-button]').click();
	await expect(page.locator('[data-calendar-month]')).toHaveText('October 2026');
	await page.getByRole('button', { name: 'Today', exact: true }).click();
	await expect(page.locator('[data-calendar-month]')).toHaveText('September 2026');
	await page.getByRole('button', { name: 'Tuesday, 15 September 2026', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Research synthesis', exact: true })
	).toBeVisible();
	await page.getByRole('button', { name: 'Today', exact: true }).click();
	await page.getByRole('button', { name: 'Edit Customer workshop revised', exact: true }).click();
	await page.getByRole('button', { name: 'Delete event', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Customer workshop revised', exact: true })
	).toHaveCount(0);
});

test('mobile tasks lifecycle and screen history preserve local work', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/templates/email-client');
	const navigation = page.getByRole('navigation', { name: 'Productivity screens' });
	await navigation.getByRole('link', { name: 'Tasks', exact: true }).click();
	await expect(page).toHaveURL(/\/tasks$/);
	await expect(page.getByRole('heading', { name: 'Tasks', exact: true })).toBeFocused();
	await page.getByRole('button', { name: 'New task', exact: true }).click();
	await page
		.getByRole('textbox', { name: 'Task name', exact: true })
		.fill('Review accessibility notes');
	await page.getByRole('button', { name: 'Save task', exact: true }).click();
	await page.getByRole('button', { name: 'Edit Review accessibility notes', exact: true }).click();
	await page.getByRole('textbox', { name: 'Task name', exact: true }).fill('Review keyboard notes');
	await page.getByRole('button', { name: 'Save task', exact: true }).click();
	await page.getByRole('checkbox', { name: 'Complete Review keyboard notes', exact: true }).click();
	await page.getByRole('button', { name: 'Completed', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Review keyboard notes', exact: true })
	).toBeVisible();
	await navigation.getByRole('link', { name: 'Calendar', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeFocused();
	await page.goBack();
	await expect(page).toHaveURL(/\/tasks$/);
	await expect(
		page.getByRole('button', { name: 'Edit Review keyboard notes', exact: true })
	).toBeVisible();
	await page.getByRole('button', { name: 'Edit Review keyboard notes', exact: true }).click();
	await page.getByRole('button', { name: 'Delete task', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Review keyboard notes', exact: true })
	).toHaveCount(0);
	await navigation.getByRole('link', { name: 'Mail', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'inbox', exact: true })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test('mail reply thread, forward draft and archive undo remain local', async ({ page }) => {
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page.getByRole('button', { name: 'Reply', exact: true }).click();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page.getByLabel('Message', { exact: true })).toBeFocused();
	await page
		.getByRole('textbox', { name: 'Message', exact: true })
		.fill('The banner copy is approved.');
	await page.getByRole('button', { name: 'Send message', exact: true }).click();
	await expect(page.getByRole('region', { name: 'Conversation history' })).toContainText(
		'The banner copy is approved.'
	);
	await page.getByRole('button', { name: 'Forward message', exact: true }).click();
	await expect(page.getByRole('textbox', { name: 'Subject', exact: true })).toHaveValue(
		'Fwd: Launch notes for tomorrow'
	);
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('button', { name: 'Archive message', exact: true }).click();
	await page.getByRole('button', { name: 'Undo archive', exact: true }).click();
	await expect(page.locator('.message-summary')).toHaveCount(5);
	await page
		.getByRole('navigation', { name: 'Mailbox', exact: true })
		.getByRole('link', { name: 'Drafts', exact: false })
		.click();
	await expect(
		page.locator('.message-summary').filter({ hasText: 'Fwd: Launch notes for tomorrow' })
	).toBeVisible();
});

test('screen history closes a portaled event editor', async ({ page }) => {
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page
		.getByRole('navigation', { name: 'Productivity screens' })
		.getByRole('link', { name: 'Calendar', exact: true })
		.click();
	await page.getByRole('button', { name: 'New event', exact: true }).click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.goBack();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page.getByRole('heading', { name: 'inbox', exact: true })).toBeVisible();
	await page.goForward();
	await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('integrated workspace creates follow-ups from mail and preserves inline composition', async ({
	page
}) => {
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	const nav = page.getByRole('navigation', { name: 'Productivity screens' });
	await nav.getByRole('link', { name: 'Tasks', exact: true }).click();
	await page.getByRole('button', { name: 'Completed', exact: true }).click();
	await page.getByLabel('Search tasks', { exact: true }).fill('no matching task');
	await nav.getByRole('link', { name: 'Mail', exact: true }).click();
	await page.getByRole('button', { name: 'Create task from message', exact: true }).click();
	await expect(page).toHaveURL(/\/tasks$/);
	await expect(
		page.getByRole('button', { name: 'Edit Launch notes for tomorrow', exact: true })
	).toBeVisible();
	await page
		.getByRole('button', { name: 'Mark Launch notes for tomorrow important', exact: true })
		.click();
	await page.getByRole('button', { name: 'Important', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Launch notes for tomorrow', exact: true })
	).toBeVisible();
	await nav.getByRole('link', { name: 'Mail', exact: true }).click();
	await page.getByRole('button', { name: 'Schedule from message', exact: true }).click();
	await expect(page.getByLabel('Event title', { exact: true })).toHaveValue(
		'Launch notes for tomorrow'
	);
	await page.getByLabel('Start time', { exact: true }).fill('12:30');
	await page.getByLabel('End time', { exact: true }).fill('13:00');
	await page.getByRole('button', { name: 'Save event', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Launch notes for tomorrow', exact: true })
	).toBeVisible();
	await nav.getByRole('link', { name: 'Mail', exact: true }).click();
	await page
		.getByRole('button', { name: 'Compose', exact: false })
		.filter({ visible: true })
		.first()
		.click();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page.getByLabel('To', { exact: true })).toBeFocused();
	await page.getByLabel('To', { exact: true }).fill('ellis@example.com');
	await page.getByLabel('Subject', { exact: true }).fill('Keep this draft');
	await page.getByLabel('Message', { exact: true }).fill('A thoughtful follow-up.');
	await nav.getByRole('link', { name: 'Tasks', exact: true }).click();
	await nav.getByRole('link', { name: 'Mail', exact: true }).click();
	await expect(page.getByLabel('Message', { exact: true })).toHaveValue('A thoughtful follow-up.');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page
		.getByRole('navigation', { name: 'Mailbox', exact: true })
		.getByRole('link', { name: 'Drafts' })
		.click();
	await page.locator('.message-summary').filter({ hasText: 'Keep this draft' }).click();
	await page.getByRole('button', { name: 'Edit draft', exact: true }).click();
	await expect(page.getByLabel('Message', { exact: true })).toHaveValue('A thoughtful follow-up.');
	await page.getByRole('button', { name: 'Send message', exact: true }).click();
	await expect(page.locator('.compose-pane')).toHaveCount(0);
});

test('mobile compose is an accessible full pane with draft-saving Back', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page
		.getByRole('button', { name: 'Compose', exact: false })
		.filter({ visible: true })
		.first()
		.click();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page.getByLabel('To', { exact: true })).toBeFocused();
	await page.getByLabel('Subject', { exact: true }).fill('Mobile draft');
	await page.getByLabel('Message', { exact: true }).fill('Preserve this while checking my day.');
	await page.locator('.compose-pane').getByRole('button', { name: 'Back', exact: true }).click();
	await expect(page.locator('#mail-reader-heading')).toBeFocused();
	await page.getByRole('button', { name: 'Back to messages', exact: true }).click();
	await expect(page.locator('#mail-list-heading')).toBeFocused();
	expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test('app navigation stays reachable on scrolled mobile and tablet task screens', async ({
	page
}) => {
	for (const width of [390, 768]) {
		await page.setViewportSize({ width, height: 844 });
		await page.goto('/templates/email-client/tasks');
		await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
			'data-ready',
			'true'
		);
		const nav = page.getByRole('navigation', { name: 'Productivity screens' });
		await expect(page.getByRole('heading', { name: 'Tasks', exact: true })).toBeVisible();
		await page.evaluate(() =>
			document
				.querySelector('[data-productivity-screen=tasks]')
				?.scrollTo({ top: 10000, behavior: 'instant' })
		);
		await expect
			.poll(async () => {
				const bounds = await nav.boundingBox();
				return bounds ? bounds.y : -Infinity;
			})
			.toBeGreaterThanOrEqual(-0.5);
		await nav.getByRole('link', { name: 'Calendar', exact: true }).click();
		await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
			false
		);
	}
});

test('mail labels narrow messages and mailbox navigation clears the label', async ({ page }) => {
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	await page.getByRole('link', { name: 'Show Research mail', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Research', exact: true })).toBeVisible();
	await expect(page.locator('.message-summary')).toHaveCount(1);
	await page
		.getByRole('navigation', { name: 'Mailbox', exact: true })
		.getByRole('link', { name: 'Inbox' })
		.click();
	await expect(page.locator('.message-summary')).toHaveCount(5);
});

test('project quick add and calendar visibility update the workspace', async ({ page }) => {
	await page.goto('/templates/email-client/tasks');
	await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
		'data-ready',
		'true'
	);
	await page
		.getByRole('navigation', { name: 'Task projects' })
		.getByRole('button', { name: 'Research' })
		.click();
	await expect(
		page.getByRole('button', { name: 'Edit Summarize interview notes', exact: true })
	).toBeVisible();
	await expect(
		page.getByRole('button', { name: 'Edit Review migration banner copy', exact: true })
	).toHaveCount(0);
	await page
		.getByRole('textbox', { name: 'Quick task name', exact: true })
		.fill('Prepare interview guide');
	await page.getByRole('button', { name: 'Add task', exact: true }).click();
	await page.getByRole('button', { name: 'Edit Prepare interview guide', exact: true }).click();
	await expect(page.getByRole('textbox', { name: 'Project', exact: true })).toHaveValue('Research');
	await page.keyboard.press('Escape');
	await page
		.getByRole('navigation', { name: 'Productivity screens' })
		.getByRole('link', { name: 'Calendar', exact: true })
		.click();
	await expect(page.getByLabel('Day summary')).toContainText('2h');
	await page.getByRole('button', { name: 'Show Focus calendar', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Prototype review', exact: true })
	).toHaveCount(0);
	await expect(page.getByLabel('Day summary')).toContainText('0m');
	await page.getByRole('button', { name: 'Show Focus calendar', exact: true }).click();
	await expect(
		page.getByRole('button', { name: 'Edit Prototype review', exact: true })
	).toBeVisible();
});

test('mail deep links reload and account shell survives navigation', async ({ page }) => {
	await page.goto('/templates/email-client/mail/inbox/june-research-window');
	await expect(
		page.getByRole('heading', { name: 'Research window next week', exact: true })
	).toBeVisible();
	await page.reload();
	await expect(
		page.getByRole('heading', { name: 'Research window next week', exact: true })
	).toBeVisible();
	const shell = await page.locator('.workspace-topbar').elementHandle();
	await page
		.getByRole('navigation', { name: 'Productivity screens' })
		.getByRole('link', { name: 'Tasks', exact: true })
		.click();
	expect(await shell?.evaluate((node) => node.isConnected)).toBe(true);
	await page.getByRole('button', { name: 'Open account menu', exact: true }).click();
	await expect(page.getByText('alex@lumenmail.example', { exact: true })).toBeVisible();
	await page.keyboard.press('Escape');
	await page.goBack();
	await expect(page).toHaveURL(/\/mail\/inbox\/june-research-window$/);
	await expect(
		page.getByRole('heading', { name: 'Research window next week', exact: true })
	).toBeVisible();
});

test('calendar scroll stays within the workspace on desktop and mobile', async ({ page }) => {
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/templates/email-client/calendar');
		await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= innerHeight))
			.toBe(true);
		await page.getByRole('button', { name: 'Next month', exact: true }).click();
		await expect(page.locator('[data-calendar-month]')).toHaveText('October 2026');
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= innerHeight))
			.toBe(true);
	}
});

test('mail density reduces row height and persists across screens and reload', async ({ page }) => {
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	const row = page.locator('.message-row').first();
	const comfortable = (await row.boundingBox())!.height;
	await page.getByRole('button', { name: 'Mail list density' }).click();
	await page.getByRole('menuitemradio', { name: 'Compact', exact: true }).click();
	await expect(page.locator('.mail-app')).toHaveAttribute('data-density', 'compact');
	expect((await row.boundingBox())!.height).toBeLessThan(comfortable * 0.75);
	await page
		.getByRole('navigation', { name: 'Productivity screens' })
		.getByRole('link', { name: 'Tasks', exact: true })
		.click();
	await page
		.getByRole('navigation', { name: 'Productivity screens' })
		.getByRole('link', { name: 'Mail', exact: true })
		.click();
	await expect(page.locator('.mail-app')).toHaveAttribute('data-density', 'compact');
	await page.reload();
	await expect(page.locator('.mail-app')).toHaveAttribute('data-density', 'compact');
	await page.getByRole('button', { name: 'Mail list density' }).click();
	await page.getByRole('menuitemradio', { name: 'Comfortable', exact: true }).click();
	await expect(page.locator('.mail-app')).toHaveAttribute('data-density', 'comfortable');
});

test('inline replies retain message context, support all recipients and discard cleanly', async ({
	page
}) => {
	await page.goto('/templates/email-client');
	await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
	const history = await page.getByRole('region', { name: 'Conversation history' }).boundingBox();
	const actions = await page.locator('.message-actions').boundingBox();
	expect(actions!.y - (history!.y + history!.height)).toBeGreaterThanOrEqual(24);
	await page.getByRole('button', { name: 'Reply all', exact: true }).click();
	await expect(page.locator('#mail-reader-heading')).toBeVisible();
	await expect(page.getByLabel('To', { exact: true })).toHaveValue(
		'marin@northstar.example,product@northstar.example'
	);
	await page.getByLabel('Message', { exact: true }).fill('Thanks, everyone.');
	await page.getByRole('button', { name: 'Send message', exact: true }).click();
	await expect(page.getByRole('region', { name: 'Conversation history' })).toContainText(
		'Thanks, everyone.'
	);
	await page.getByRole('button', { name: 'Reply', exact: true }).click();
	await page.getByLabel('Message', { exact: true }).fill('Discard this draft.');
	await page.getByRole('button', { name: 'Discard', exact: true }).click();
	await expect(page.locator('.inline-reply')).toHaveCount(0);
	await expect(page.locator('#mail-reader-heading')).toBeFocused();
	await expect(page.getByRole('region', { name: 'Conversation history' })).not.toContainText(
		'Discard this draft.'
	);
});

test('account address fits its menu on desktop and mobile', async ({ page }) => {
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/templates/email-client');
		await expect(page.locator('.mail-app')).toHaveAttribute('data-ready', 'true');
		await page.getByRole('button', { name: 'Open account menu', exact: true }).click();
		const email = page.getByText('alex@lumenmail.example', { exact: true });
		await expect(email).toBeVisible();
		const bounds = await email.boundingBox();
		const menu = await page.getByRole('menu').boundingBox();
		expect(bounds!.x).toBeGreaterThanOrEqual(menu!.x);
		expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(menu!.x + menu!.width);
		expect(menu!.x + menu!.width).toBeLessThanOrEqual(width);
		expect(await email.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
		await page.keyboard.press('Escape');
	}
});
