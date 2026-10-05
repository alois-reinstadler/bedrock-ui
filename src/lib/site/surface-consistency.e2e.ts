import { expect, test } from '../../../scripts/shared-browser-test';

for (const colorScheme of ['light', 'dark'] as const) {
	test(`hero honors live OS reduction and keeps mobile focus stationary: ${colorScheme}`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.emulateMedia({ colorScheme, reducedMotion: 'no-preference' });
		await page.goto('/');
		const scene = page.locator('.constellation');
		await expect(scene).toHaveAttribute('data-reduced-motion', 'false');
		const box = (await scene.boundingBox())!;
		await scene.dispatchEvent('pointermove', {
			pointerType: 'mouse',
			clientX: box.x + box.width * 0.9,
			clientY: box.y + box.height * 0.6
		});
		await expect
			.poll(() => scene.evaluate((e) => e.style.getPropertyValue('--scene-x')))
			.not.toBe('0deg');
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await expect(scene).toHaveAttribute('data-reduced-motion', 'true');
		await expect
			.poll(() => scene.evaluate((e) => e.style.getPropertyValue('--scene-x')))
			.toBe('0deg');
		const plane = page.locator('.plane-command');
		const stationary = await plane.evaluate((e) => getComputedStyle(e).transform);
		await page.locator('#hero-component-search').focus();
		await expect(plane).toHaveCSS('transform', stationary);
		await expect(page.locator('.world')).toHaveCSS('transition-duration', '0s');
		await scene.dispatchEvent('pointermove', {
			pointerType: 'mouse',
			clientX: box.x + box.width * 0.2,
			clientY: box.y + box.height * 0.2
		});
		await expect
			.poll(() => scene.evaluate((e) => e.style.getPropertyValue('--scene-x')))
			.toBe('0deg');
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await page.setViewportSize({ width: 390, height: 844 });
		await page.locator('#hero-component-search').focus();
		await expect(plane).toHaveCSS('transform', 'none');
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
			.toBe(true);
	});

	test(`gallery and documentation table frames inherit live corner tokens: ${colorScheme}`, async ({
		page
	}) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		for (const [path, selector] of [
			['/', '.hero-surface'],
			['/docs/templates', '.template-card'],
			['/docs/shaders', '[data-slot="clickable-card"]'],
			['/docs/components/button?tab=properties', '[data-doc-tab="properties"] .corner-theme'],
			['/docs/components/button?tab=accessibility', '[data-doc-tab="accessibility"] .corner-theme']
		]) {
			await page.goto(path);
			const surface = page.locator(selector).first();
			await expect(surface).toBeVisible();
			await expect(surface).toHaveCSS('corner-shape', 'superellipse(3)');
			const radius = await surface.evaluate((e) => getComputedStyle(e).borderRadius);
			await page.evaluate(() =>
				document.documentElement.style.setProperty('--corner-shape', 'bevel')
			);
			await expect(surface).toHaveCSS('corner-shape', /^(bevel|superellipse\(0\))$/);
			await expect(surface).toHaveCSS('border-radius', radius);
		}
	});
}

for (const [slug, heading] of [
	['blockquote', 'Make the next step visible'],
	['citation', 'Label controls by their purpose'],
	['text', 'Make room for a calmer workday'],
	['separator', 'Order summary']
]) {
	test(`Card migration preserves the ${slug} article`, async ({ page }) => {
		await page.goto(`/docs/components/${slug}`);
		const article = page.locator('[data-slot="card"][role="article"]').filter({
			has: page.getByRole('heading', { name: heading, exact: true })
		});
		await expect(article).toBeVisible();
	});
}

test('template cards retain article semantics', async ({ page }) => {
	await page.goto('/docs/templates');
	const cards = page.locator('.template-card');
	await expect(cards).toHaveCount(4);
	for (const card of await cards.all()) await expect(card).toHaveAttribute('role', 'article');
});

test('Navigation Menu popup escapes the example card and its last link remains usable', async ({
	page
}) => {
	await page.setViewportSize({ width: 1024, height: 900 });
	await page.goto('/docs/components/navigation-menu');
	const demo = page.getByRole('region', { name: 'In practice', exact: true });
	await expect(demo.getByRole('button', { name: 'Products', exact: true })).toBeVisible();
	await demo.getByRole('button', { name: 'Products', exact: true }).click();
	await expect(demo.locator('[data-slot="card"]').first()).toHaveCSS('overflow', 'visible');
	const destination = demo.getByRole('link', { name: 'Installation', exact: true });
	await expect(destination).toBeVisible();
	await destination.click();
	await expect(page).toHaveURL('/docs/installation');
});

test('Tokenizer can create a topic from its popup below the example card', async ({ page }) => {
	await page.goto('/docs/components/tokenizer');
	const demo = page.getByRole('region', { name: 'In practice', exact: true });
	await expect(demo.locator('[data-slot="card"]').first()).toHaveCSS('overflow', 'visible');
	await demo.getByPlaceholder('Add tags…', { exact: true }).fill('Launch review');
	const create = demo.getByRole('option').filter({ hasText: 'Launch review' });
	await expect(create).toBeVisible();
	await create.click();
	await expect(demo.getByRole('status').filter({ hasText: 'topics added' })).toContainText(
		'1 topics added'
	);
});
