import { expect, test } from '@playwright/test';

test('imports are highlighted without JavaScript', async ({ browser, baseURL }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	try {
		await page.goto(`${baseURL}/docs/components/avatar`);
		const code = page.locator('#installation pre');
		await expect(code).toContainText("import * as Avatar from '#lib/bedrock/ui/avatar';");
		expect(await code.locator('[style*="--shiki-light"]').count()).toBeGreaterThan(2);
	} finally {
		await context.close();
	}
});

test('source loads on demand and renders colored tokens in both themes', async ({ page }) => {
	const requests: string[] = [];
	const errors: string[] = [];
	page.on('request', (request) => requests.push(request.url()));
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/avatar');
	await expect(page.locator('#preview')).toBeVisible();
	await expect(page.locator('#examples')).toContainText('In practice');
	expect(requests.some((url) => url.includes('/source.json'))).toBe(false);
	await page.locator('#example-source-trigger-avatar').click();
	const source = page.locator('#example-source-content-avatar');
	await expect(source.locator('pre')).toBeVisible();
	expect(requests.some((url) => url.includes('/source.json'))).toBe(true);
	for (const dark of [false, true]) {
		await page.evaluate((dark) => document.documentElement.classList.toggle('dark', dark), dark);
		const colors = await page
			.locator('#installation .line span')
			.evaluateAll((spans) => [...new Set(spans.map((span) => getComputedStyle(span).color))]);
		expect(colors.length).toBeGreaterThan(1);
	}
	expect(errors).toEqual([]);
});

test('navigation stays consistent while an example chunk is delayed', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('response', (response) => {
		if (response.status() >= 500) errors.push(`${response.status()} ${response.url()}`);
	});
	await page.route('**/_app/immutable/chunks/**', async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 80));
		await route.continue().catch(() => {});
	});
	for (let visit = 0; visit < 2; visit++) {
		await page.goto('/docs/components/card');
		for (const [slug, title] of [
			['slider', 'Slider'],
			['avatar', 'Avatar'],
			['button', 'Button']
		]) {
			await page
				.locator('[data-slot="sidebar"]')
				.getByRole('link', { name: title, exact: true })
				.click();
			await expect(page.locator('[data-doc-slug]')).toHaveAttribute('data-doc-slug', slug);
			await expect(page.locator('h1')).toHaveText(title);
			await expect(page.locator('#installation .shiki')).toBeVisible();
		}
	}
	expect(errors).toEqual([]);
});
