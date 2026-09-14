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
		await expect(installation.locator('pre code')).toContainText('import');
	});

	test('keeps component reference tabs addressable across navigation and reload', async ({
		page
	}) => {
		const pageErrors: string[] = [];
		page.on('pageerror', (exception) => pageErrors.push(exception.message));

		await page.goto('/docs/components/button?tab=properties');
		await expect(page).toHaveURL(/\/docs\/components\/button\?tab=properties$/);
		await expect(page.locator('[data-doc-tab="properties"]')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Public API' })).toBeVisible();
		await expect(page.getByRole('columnheader', { name: 'Type' }).first()).toBeVisible();
		await expect(page.getByText('variant', { exact: true }).first()).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Property playground' })).toBeVisible();

		await page.reload();
		await expect(page.getByRole('link', { name: 'Properties', exact: true })).toHaveAttribute(
			'aria-current',
			'page'
		);

		await page.getByRole('link', { name: 'Accessibility', exact: true }).click();
		await expect(page).toHaveURL(/\/docs\/components\/button\?tab=accessibility$/);
		await expect(page.locator('[data-doc-tab="accessibility"]')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Color contrast' })).toBeVisible();
		await expect(page.getByRole('rowheader', { name: 'Text label' })).toBeVisible();
		await expect(page.getByText('72 generated pairs')).toBeVisible();

		await page.reload();
		await expect(page.getByRole('link', { name: 'Accessibility', exact: true })).toHaveAttribute(
			'aria-current',
			'page'
		);
		await expect(pageErrors).toEqual([]);
	});

	test('exposes component-specific known accessibility gaps', async ({ page }) => {
		for (const slug of ['badge', 'avatar', 'slider']) {
			await page.goto(`/docs/components/${slug}?tab=accessibility`);
			await expect(page.getByText('Needs attention')).toBeVisible();
		}
	});
});
