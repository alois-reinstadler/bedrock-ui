import { expect, test } from './shared-browser';
import AxeBuilder from '@axe-core/playwright';

test('mentions and commands select with keyboard and retain structured context after failed sends', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-context"]');
	const input = demo.getByRole('textbox');
	await input.fill('@');
	await expect(demo.getByRole('listbox', { name: 'Mention sources' })).toBeVisible();
	await expect(demo.getByRole('option')).toHaveCount(2);
	await input.press('ArrowDown');
	await expect(demo.getByRole('option').nth(1)).toHaveAttribute('aria-selected', 'true');
	await input.press('Enter');
	await expect(demo.getByRole('button', { name: 'Remove: Roadmap', exact: true })).toBeVisible();
	await expect(demo.locator('output')).toBeEmpty();
	await input.fill('@rel');
	await input.press('Enter');
	await input.fill('/sum');
	await input.press('Enter');
	await expect(demo.getByRole('button', { name: 'Remove: Summarize', exact: true })).toBeVisible();
	await demo.getByRole('button', { name: 'Fail next context send' }).click();
	await demo.getByRole('button', { name: 'Send', exact: true }).click();
	await expect(demo.getByRole('alert')).toBeVisible();
	await expect(demo.getByRole('button', { name: 'Remove: Roadmap', exact: true })).toBeVisible();
	await demo.getByRole('button', { name: 'Remove: Roadmap', exact: true }).click();
	await demo.getByRole('button', { name: 'Send', exact: true }).click();
	await expect(demo.locator('output')).toHaveText(
		'{"message":"","context":["release"],"command":"summarize"}'
	);
	await expect(demo.locator('[data-slot="chat-prompt-context"]')).toHaveCount(0);
	expect(errors).toEqual([]);
});

test('autocomplete ignores emails and caret selections, offers empty results, and dismisses without sending', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-context"]');
	const input = demo.getByRole('textbox');
	await input.fill('person@example.com');
	await expect(demo.getByRole('listbox')).toHaveCount(0);
	await input.fill('@missing');
	await expect(demo.getByRole('listbox')).toContainText('No matches');
	await input.press('Enter');
	await expect(demo.locator('output')).toBeEmpty();
	await input.press('Escape');
	await expect(demo.getByRole('listbox')).toHaveCount(0);
	await input.fill('Use @rel next');
	await input.evaluate((node: HTMLTextAreaElement) => {
		node.setSelectionRange(8, 8);
		node.dispatchEvent(new Event('select'));
	});
	await input.press('Enter');
	await expect(input).toHaveValue('Use  next');
	await expect(demo.getByRole('button', { name: 'Remove: Release notes' })).toBeVisible();
});

test('citations preview context and restore focus; source lists expand', async ({ page }) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-sources"]');
	const citation = demo.getByRole('button', { name: '1: Release notes', exact: true });
	await citation.click();
	await expect(page.getByRole('dialog')).toContainText('Conversation UI capabilities');
	await expect(
		page.getByRole('dialog').getByRole('link', { name: 'Release notes' })
	).toHaveAttribute('href', '/docs/components/chat');
	await page.keyboard.press('Escape');
	await expect(citation).toBeFocused();
	await demo.locator('summary').click();
	await expect(
		demo.locator('[data-slot="chat-sources"] [data-slot="chat-source-card"]')
	).toHaveCount(2);
	await expect(
		demo.locator('[data-slot="chat-sources"]').getByRole('link', { name: 'Customer interviews' })
	).toHaveCount(0);
});

test('approval retries failed decisions and settles only after explicit approval', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-decisions"]');
	const approval = demo.locator('[data-slot="chat-approval"]');
	await expect(demo.locator('output')).toBeEmpty();
	await demo.getByRole('button', { name: 'Fail next decision' }).click();
	await approval.getByRole('button', { name: 'Approve', exact: true }).click();
	await expect(approval.getByRole('alert')).toContainText('Could not save');
	await approval.getByRole('button', { name: 'Approve', exact: true }).click();
	await expect(approval.getByRole('status')).toHaveText('Approved');
	await expect(approval.getByRole('button')).toHaveCount(0);
	await expect(demo.locator('output')).toHaveText('Decision: approved');
	await demo.getByRole('button', { name: 'Reset decisions' }).click();
	await approval.getByRole('button', { name: 'Reject', exact: true }).click();
	await expect(approval.getByRole('status')).toHaveText('Rejected');
});

test('questions validate, preserve custom answers on back, skip optional answers, and recover submission', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-decisions"]');
	const questions = demo.locator('[data-slot="chat-questions"]');
	await expect(questions.getByRole('button', { name: 'Continue', exact: true })).toBeDisabled();
	await questions.getByRole('textbox', { name: 'Custom answer' }).fill('Design partners');
	await questions.getByRole('button', { name: 'Continue', exact: true }).click();
	await questions.getByRole('radio', { name: 'Friendly', exact: true }).check();
	await questions.getByRole('button', { name: 'Back', exact: true }).click();
	await expect(questions.getByRole('textbox')).toHaveValue('Design partners');
	await questions.getByRole('button', { name: 'Continue', exact: true }).click();
	await expect(questions.getByRole('radio', { name: 'Friendly', exact: true })).toBeChecked();
	await demo.getByRole('button', { name: 'Fail next decision' }).click();
	await questions.getByRole('button', { name: 'Skip', exact: true }).click();
	await expect(questions.getByRole('alert')).toBeVisible();
	await questions.getByRole('button', { name: 'Submit answers', exact: true }).click();
	await expect(questions.getByRole('status')).toHaveText('Answers submitted');
	await expect(demo.locator('output')).toHaveText(
		'Answers: {"audience":"Design partners","tone":""}'
	);
});

test('recommendations accept the selected alternative with rejection recovery and support dismissal', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-decisions"]');
	const rec = demo.locator('[data-slot="chat-recommendation"]');
	await rec.getByRole('radio', { name: /Release to everyone/ }).check();
	await demo.getByRole('button', { name: 'Fail next decision' }).click();
	await rec.getByRole('button', { name: 'Accept recommendation' }).click();
	await expect(rec.getByRole('alert')).toBeVisible();
	await expect(rec.getByRole('radio', { name: /Release to everyone/ })).toBeChecked();
	await rec.getByRole('button', { name: 'Accept recommendation' }).click();
	await expect(demo.locator('output')).toHaveText('Accepted: all');
	await expect(rec.getByRole('radio').first()).toBeDisabled();
	await demo.getByRole('button', { name: 'Reset decisions' }).click();
	await rec.getByRole('button', { name: 'Dismiss', exact: true }).click();
	await expect(rec.getByRole('status')).toHaveText('Recommendation dismissed');
});

test('activity details update, and change review applies only selected units after recovery', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-workflow"]');
	const activity = demo.locator('[data-slot="chat-activity"]');
	await activity.locator('summary').nth(1).click();
	await expect(activity.getByRole('progressbar')).toHaveAttribute('value', '60');
	await demo.getByRole('button', { name: 'Fail review task' }).click();
	await expect(activity.locator('[data-status="error"]')).toContainText('A check failed');
	await demo.getByRole('button', { name: 'Toggle activity layout' }).click();
	await demo.getByRole('button', { name: 'Complete tasks' }).click();
	await expect(activity.locator('[data-status="complete"]')).toHaveCount(3);
	const review = demo.locator('[data-slot="chat-change-review"]');
	await review.locator('summary').nth(1).click();
	await expect(review.locator('pre').last()).toContainText('+Review transcripts');
	await review.getByRole('checkbox', { name: 'Clarify description', exact: true }).uncheck();
	await demo.getByRole('button', { name: 'Fail next change apply' }).click();
	await review.getByRole('button', { name: 'Apply selected changes (1)', exact: true }).click();
	await expect(review.getByRole('alert')).toBeVisible();
	await review.getByRole('button', { name: 'Apply selected changes (1)', exact: true }).click();
	await expect(demo.locator('output')).toHaveText('Applied: heading');
	await expect(review.getByRole('status')).toHaveText('Changes applied');
});

test('selection actions capture only response text and support keyboard activation', async ({
	page
}) => {
	await page.goto('/docs/components/chat');
	const demo = page.locator('[data-demo="chat-workflow"]');
	const select = demo.locator('[data-slot="chat-selection-actions"]');
	await expect(select.getByRole('button', { name: 'Quote', exact: true })).toBeDisabled();
	await select
		.locator('p')
		.first()
		.evaluate((node) => {
			const range = document.createRange();
			range.setStart(node.firstChild!, 0);
			range.setEnd(node.firstChild!, 21);
			const selection = getSelection()!;
			selection.removeAllRanges();
			selection.addRange(range);
			document.dispatchEvent(new Event('selectionchange'));
		});
	await select.getByRole('button', { name: 'Quote', exact: true }).click();
	await expect(demo.getByRole('textbox')).toHaveValue('quote: The new chat controls');
	await select.getByRole('button', { name: 'Select response text', exact: true }).focus();
	await page.keyboard.press('Enter');
	await select.getByRole('button', { name: 'Explain', exact: true }).click();
	await expect(demo.getByRole('textbox')).toHaveValue(/explain: The new chat controls.*draft\./);
});

test('new workflow cards have code, fit mobile themes, and expose accessible controls', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/components/chat');
	for (const slug of ['chat-context', 'chat-sources', 'chat-decisions', 'chat-workflow']) {
		const card = page.locator(`#${slug}`);
		await card.getByRole('tab', { name: 'Code', exact: true }).click();
		await expect(
			card.getByRole('tabpanel', { name: 'Code', exact: true }).locator('pre')
		).toContainText('Chat.');
		await card.getByRole('tab', { name: 'Preview', exact: true }).click();
	}
	await page.locator('#chat-context').getByRole('textbox').fill('@');
	for (const dark of [false, true]) {
		await page.evaluate((value) => document.documentElement.classList.toggle('dark', value), dark);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		const report = await new AxeBuilder({ page })
			.include('#chat-context')
			.include('#chat-sources')
			.include('#chat-decisions')
			.include('#chat-workflow')
			.disableRules(['color-contrast'])
			.analyze();
		expect(report.violations).toEqual([]);
	}
	await page.locator('#chat-context').screenshot({ path: '/tmp/chat-context-mobile.png' });
	await page.locator('#chat-decisions').screenshot({ path: '/tmp/chat-decisions-mobile.png' });
});
