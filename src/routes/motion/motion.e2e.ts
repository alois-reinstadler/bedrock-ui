import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/motion');
	await expect(page.getByTestId('bedrock-native-action')).toBeVisible();
});

test('native activation is exactly once for pointer, Enter and Space', async ({ page }) => {
	const button = page.getByTestId('bedrock-native-action');
	await button.click();
	await expect(button).toHaveText('Pressed 1 times');
	await button.press('Enter');
	await expect(button).toHaveText('Pressed 2 times');
	await button.press('Space');
	await expect(button).toHaveText('Pressed 3 times');
});

test('CSS exit retains the node and reversing it preserves its state', async ({ page }) => {
	const panel = page.getByTestId('bedrock-css-panel');
	await expect(panel).toHaveCSS('opacity', '1');
	await page.getByTestId('bedrock-native-action').click();
	// Trigger and inspect in the same task, before an outro can finish on a busy runner.
	const retained = await page.getByTestId('bedrock-css-toggle').evaluate(async (toggle) => {
		(toggle as HTMLButtonElement).click();
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		const exiting = document.querySelector('[data-testid="bedrock-css-panel"]');
		(toggle as HTMLButtonElement).click();
		return exiting !== null;
	});
	expect(retained).toBe(true);
	await expect(panel).toHaveCSS('opacity', '1');
	await expect(page.getByTestId('bedrock-native-action')).toHaveText('Pressed 1 times');
	await page.getByTestId('bedrock-css-toggle').click();
	await expect(panel).toHaveCount(0);
	await page.getByTestId('bedrock-css-toggle').click();
	await expect(panel).toHaveCSS('opacity', '1');
	await expect(page.getByTestId('bedrock-native-action')).toHaveText('Pressed 1 times');
});

test('CSS retargeting responds to reduced-motion policy changes after mount', async ({ page }) => {
	const panel = page.getByTestId('bedrock-css-panel');
	await expect(panel).toHaveCSS('opacity', '1');
	await page.getByTestId('bedrock-css-retarget').click();
	await expect
		.poll(() => panel.evaluate((node) => Number.parseFloat(getComputedStyle(node).translate) || 0))
		.toBe(32);
	await page.getByTestId('bedrock-motion-reduced').check();
	await expect
		.poll(() => panel.evaluate((node) => Number.parseFloat(getComputedStyle(node).translate) || 0))
		.toBe(0);
	await page.getByTestId('bedrock-motion-reduced').uncheck();
	await expect
		.poll(() => panel.evaluate((node) => Number.parseFloat(getComputedStyle(node).translate) || 0))
		.toBe(32);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect
		.poll(() => panel.evaluate((node) => Number.parseFloat(getComputedStyle(node).translate) || 0))
		.toBe(0);
});

test('engine panel exits and re-enters without runtime errors', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	const panel = page.getByTestId('bedrock-engine-panel');
	await expect(panel).toHaveCSS('opacity', '1');
	await page.getByTestId('bedrock-engine-toggle').click();
	await expect(panel).toHaveCount(0);
	await page.getByTestId('bedrock-engine-toggle').click();
	await expect(panel).toHaveCSS('opacity', '1');
	await page.getByTestId('bedrock-motion-reduced').check();
	await page.getByTestId('bedrock-engine-toggle').click();
	await expect(panel).toHaveCount(0);
	expect(errors).toEqual([]);
});
