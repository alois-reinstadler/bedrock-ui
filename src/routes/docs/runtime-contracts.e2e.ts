import { expect, test } from '../../../scripts/shared-browser-test';

test.describe.configure({ timeout: 90_000 });

test('prototype delayed links disable speculative loading with valid values', async ({ page }) => {
	await page.goto('/demo/motion-route-prototype/list');
	for (const name of [
		'Open A with delayed data and media readiness',
		'Open A beyond the readiness budget'
	]) {
		await expect(page.getByRole('link', { name, exact: true })).toHaveAttribute(
			'data-sveltekit-preload-data',
			'false'
		);
	}
});

test('block reference tabs retain valid full navigation and history', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/blocks/authentication-panel');
	for (let cycle = 0; cycle < 2; cycle++) {
		const navigation = page.getByRole('navigation', { name: 'Block reference' });
		await expect(navigation).toHaveAttribute('data-sveltekit-reload', '');
		await navigation.getByRole('link', { name: 'Properties', exact: true }).click();
		await expect(page.locator('[data-doc-tab="properties"]')).toBeVisible();
		// History may restore this full-navigation page from BFCache without a new load event.
		await page.goBack({ waitUntil: 'commit' });
		await expect(page.locator('[data-doc-tab="overview"]')).toBeVisible();
	}
	expect(errors).toEqual([]);
});

for (const colorScheme of ['light', 'dark'] as const) {
	test(`tooltip exposes its description through focus, Escape and hover (${colorScheme})`, async ({
		page
	}) => {
		await page.emulateMedia({ colorScheme });
		await page.goto('/docs/components/tooltip');
		const trigger = page.getByRole('button', { name: 'Hover me', exact: true });
		await expect(trigger).toBeVisible({ timeout: 30_000 });
		await trigger.focus();
		await expect(trigger).toHaveAccessibleDescription('Writes to the night log');
		const content = page.getByRole('tooltip', { name: 'Writes to the night log', exact: true });
		await expect(content).toBeVisible();
		const id = await content.getAttribute('id');
		expect(id).toBeTruthy();
		await expect(trigger).toHaveAttribute('aria-describedby', id!);
		await page.keyboard.press('Escape');
		await expect(trigger).not.toHaveAttribute('aria-describedby');
		await expect(trigger).toBeFocused();
		await expect(content).toHaveCount(0);
		await page.keyboard.press('Tab');
		await page.mouse.move(0, 0);
		await trigger.hover();
		await expect(trigger).toHaveAccessibleDescription('Writes to the night log');
	});
}

test('lazy Form mounts before and after docs tab navigation without removed-store errors', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	await page.goto('/docs/components/form');
	for (let cycle = 0; cycle < 2; cycle++) {
		await expect(page.getByRole('textbox', { name: 'Email address', exact: true })).toHaveCount(2, {
			timeout: 30_000
		});
		const demo = page.getByRole('region', { name: 'In practice', exact: true });
		await demo
			.getByRole('textbox', { name: 'Email address', exact: true })
			.fill('audit@example.com');
		await demo.getByRole('button', { name: 'Save recovery email', exact: true }).click();
		await expect(
			demo.getByRole('status').filter({ hasText: 'Recovery email updated' })
		).toContainText('Recovery email updated to audit@example.com');
		for (const tab of ['Properties', 'Accessibility', 'Overview']) {
			const link = page.getByRole('link', { name: tab, exact: true });
			await expect(link).toHaveAttribute('data-sveltekit-reload', '');
			await link.click();
			await expect(page.getByRole('link', { name: tab, exact: true })).toHaveAttribute(
				'aria-current',
				'page'
			);
			if (tab !== 'Overview') {
				await expect(page.locator(`[data-doc-tab="${tab.toLowerCase()}"]`)).toBeVisible();
			}
		}
	}
	expect(errors).toEqual([]);
});

for (const path of [
	'/docs/components/audit-missing',
	'/templates/video-library/title/audit-missing',
	'/audit-missing'
]) {
	test(`404 recovery preserves status and accessible navigation at ${path}`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.emulateMedia({ colorScheme: 'dark' });
		const response = await page.goto(path);
		expect(response?.status()).toBe(404);
		await expect(page).toHaveTitle('404 · Page not found — Bedrock');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Page not found', exact: true })
		).toBeVisible();
		await expect(page.getByText('Error 404', { exact: true })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Go home', exact: true })).toHaveAttribute(
			'href',
			'/'
		);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
		await page.getByRole('link', { name: 'Browse documentation', exact: true }).click();
		await expect(page).toHaveURL('/docs');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Build from stable foundations.' })
		).toBeVisible();
	});
}
