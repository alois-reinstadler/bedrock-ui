import { expect, test } from '../../scripts/shared-browser-test';
import AxeBuilder from '@axe-core/playwright';

for (const colorScheme of ['light', 'dark'] as const) {
	test(`stepped onboarding: ${colorScheme}, mobile, reduced motion`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.goto('/docs/forms');
		const form = page.locator('[data-slot="stepped-form"]');
		await expect(form).toHaveAttribute('data-ready', 'true');
		await form.getByRole('button', { name: 'Continue' }).click();
		await expect(form.getByLabel('Full name')).toBeFocused();
		await form.getByLabel('Full name').fill('Ada North');
		await form.getByLabel('Full name').press('Enter');
		await expect(form.getByRole('heading', { name: 'Name your workspace' })).toBeFocused();
		await form.getByLabel('Workspace name').fill('Field notes');
		await form.getByRole('button', { name: 'Continue' }).click();
		await expect(form.getByText('Field notes', { exact: true })).toBeVisible();
		await form.getByRole('button', { name: 'Back' }).click();
		await expect(form.getByLabel('Workspace name')).toHaveValue('Field notes');
		await form.getByRole('button', { name: 'Continue' }).click();
		expect(
			await form
				.locator('[data-stepped-form-step="review"]')
				.evaluate((node) => getComputedStyle(node).animationName)
		).toBe('none');
		const a11y = await new AxeBuilder({ page }).include('[data-slot="stepped-form"]').analyze();
		expect(a11y.violations).toEqual([]);
		await form.getByRole('button', { name: 'Create workspace' }).click();
		await expect(page.getByRole('heading', { name: 'Welcome to Field notes' })).toBeVisible();
		await expect(
			page.getByRole('status').filter({ hasText: 'Your workspace is ready, Ada North.' })
		).toBeVisible();
		await page.getByRole('button', { name: 'Start again' }).click();
		await expect(form.getByLabel('Full name')).toHaveValue('');
		expect(errors).toEqual([]);
	});
}
