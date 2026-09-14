import { expect, test } from '@playwright/test';

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
	test(`template route transitions: ${reducedMotion}`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion });
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		page.on('response', (response) => {
			if (response.status() >= 500) errors.push(`${response.status()} ${response.url()}`);
		});
		await page.goto('/templates/music-player');
		for (const [title, slug] of [
			['Video Library', 'video-library'],
			['Email Client', 'email-client'],
			['Social Network', 'social-network'],
			['Music Player', 'music-player']
		]) {
			await page
				.getByRole('navigation', { name: 'Live templates' })
				.getByRole('link', { name: title, exact: true })
				.click();
			await expect(page).toHaveURL(new RegExp(`/templates/${slug}$`));
			await expect(
				page
					.getByRole('navigation', { name: 'Live templates' })
					.getByRole('link', { name: title, exact: true })
			).toHaveAttribute('aria-current', 'page');
			await expect(page.locator('.template-screen')).not.toBeEmpty();
		}
		if (reducedMotion === 'reduce')
			await expect(page.locator('.template-screen')).toHaveCSS('view-transition-name', 'none');
		await page.getByRole('link', { name: 'Back to templates' }).click();
		await expect(page).toHaveURL(/\/docs\/templates$/);
		expect(errors).toEqual([]);
	});
}
