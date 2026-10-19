import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('the article toggle saves and removes an article', async ({ app, agent, screen }) => {
	await app.open('/docs/components/toggle');
	await agent.act('Save the article titled "A little less, but better." to the reading list.');
	await expect(screen.getByRole('button', 'Save article')).toHaveAttribute('aria-pressed', 'true');
	await expect(
		screen.getByRole('status').filter({ hasText: 'Added to your reading list.' })
	).toBeVisible();
	await agent.act('Remove the same article from the reading list.');
	await expect(screen.getByRole('button', 'Save article')).toHaveAttribute('aria-pressed', 'false');
	await expect(
		screen.getByRole('status').filter({ hasText: 'Save this article to read it later.' })
	).toBeVisible();
});

test('the workspace example completes with the entered details', async ({ app, agent, screen }) => {
	await app.open('/docs/components/stepped-form');
	await agent.act(
		'Complete the first "Create a team workspace" example with full name {name} and workspace name {workspace}, review the details, and create the workspace.',
		{
			params: { name: 'Alex Morgan', workspace: 'Studio North' }
		}
	);
	await expect(screen.getByRole('heading', 'Welcome to Studio North')).toBeVisible();
	await expect(
		screen.getByRole('status').filter({ hasText: 'Your workspace is ready, Alex Morgan.' })
	).toBeVisible();
});
