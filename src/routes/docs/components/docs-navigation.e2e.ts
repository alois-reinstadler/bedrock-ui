import { expect, test } from '@playwright/test';

test.describe('component documentation navigation', () => {
	test('keeps page content in sync across rapid docs navigation', async ({ page }) => {
		const pageErrors: string[] = [];
		page.on('pageerror', (exception) => pageErrors.push(exception.message));
		await page.goto('/docs/components/card');

		const assertPage = async (slug: string, title: string) => {
			await expect(page).toHaveURL(new RegExp(`/docs/components/${slug}$`));
			const article = page.locator(`[data-doc-slug="${slug}"]`);
			await expect(article).toBeVisible();
			await expect(article.getByRole('heading', { level: 1 })).toHaveText(title);
			await expect(article.getByRole('heading', { name: 'What it is' })).toBeVisible();
			await expect(article.getByRole('heading', { name: 'Anatomy' })).toBeVisible();
		};

		await assertPage('card', 'Card');
		await page.getByRole('link', { name: 'Slider', exact: true }).click();
		await assertPage('slider', 'Slider');
		await page.getByRole('link', { name: 'Video Player', exact: true }).click();
		await assertPage('video-player', 'Video Player');
		await page.getByRole('link', { name: 'Progressive Blur', exact: true }).click();
		await assertPage('progressive-blur', 'Progressive Blur');

		await page
			.locator('[data-slot="sidebar"]')
			.getByRole('link', { name: 'Installation', exact: true })
			.click();
		await expect(page).toHaveURL(/\/docs\/installation$/);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Installation');
		await page.getByRole('link', { name: 'Card', exact: true }).click();
		await assertPage('card', 'Card');
		expect(pageErrors).toEqual([]);
	});

	test('uses Bedrock timing tokens and avoids a duplicate TypeScript label', async ({ page }) => {
		await page.goto('/docs/components/card');

		const timing = await page.locator('[data-slot="sidebar-gap"]').evaluate((element) => {
			const styles = getComputedStyle(element);
			return {
				duration: styles.transitionDuration,
				timingFunction: styles.transitionTimingFunction
			};
		});
		expect(timing.duration).toBe('0.31s');
		expect(timing.timingFunction).toContain('cubic-bezier');

		const installation = page.locator('#installation');
		await expect(installation.getByRole('heading', { name: 'Installation' })).toBeVisible();
		const importHeader = installation.locator('[data-slot="code-block-header"]');
		await expect(importHeader).toHaveText(/TypeScript/);
		await expect(importHeader).not.toContainText('typescript');
	});
});
