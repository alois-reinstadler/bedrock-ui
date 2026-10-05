import { expect, test } from '../../../scripts/shared-browser-test';

for (const colorScheme of ['light', 'dark'] as const) {
	test(`sidebar surface, spacing and hover hierarchy: ${colorScheme}`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await page.goto('/docs/components/accordion');
		const sidebar = page.locator('[data-slot="sidebar-inner"]');
		await expect(sidebar).toBeVisible();
		const background = await page
			.locator('body')
			.evaluate((node) => getComputedStyle(node).backgroundColor);
		await expect(sidebar).toHaveCSS('background-color', background);
		const menu = sidebar.locator('[data-sidebar="menu"]').first();
		await expect(menu).toHaveCSS('row-gap', '4px');
		const viewport = sidebar.locator('[data-slot="scroll-area-viewport"]');
		await viewport.evaluate((node) => node.scrollTo(0, 220));
		const area = sidebar.locator('[data-slot="scroll-area"]');
		await expect(area).toHaveAttribute('data-scroll-top-hidden', 'true');
		const tint = area.locator('[data-scroll-edge="top"] [data-blur-tint]');
		await expect(tint).toHaveCSS('background-color', background);
		await expect(tint).toHaveCSS('opacity', '1');
		await expect(tint).not.toHaveCSS('mask-image', 'none');
		const active = sidebar.getByRole('link', { name: 'Accordion', exact: true });
		const other = sidebar.getByRole('link', { name: 'Alert', exact: true });
		const highlight = sidebar.locator('[data-slot="docs-active-highlight"]');
		const activeColor = await highlight.evaluate((node) => getComputedStyle(node).backgroundColor);
		await other.hover();
		const hoverHighlight = sidebar.locator('[data-slot="docs-hover-highlight"]');
		await expect(hoverHighlight).toBeVisible();
		const hoverSurface = hoverHighlight.locator('[data-hover-surface]');
		const hoverColor = await hoverSurface.evaluate(
			(node) => getComputedStyle(node).backgroundColor
		);
		// Hover is a translucent tint, so the active surface remains visible beneath it.
		const alpha = Number(hoverColor.match(/\/\s*([\d.]+)\)/)?.[1]);
		expect(alpha).toBeCloseTo(colorScheme === 'light' ? 0.04 : 0.08);
		const activeShape = await highlight.evaluate((node) => ({
			radius: getComputedStyle(node).borderRadius,
			corner: getComputedStyle(node).getPropertyValue('corner-shape')
		}));
		await expect(hoverSurface).toHaveCSS('border-radius', activeShape.radius);
		await expect(hoverSurface).toHaveCSS('corner-shape', activeShape.corner);
		await active.hover();
		await expect(highlight).toHaveCSS('background-color', activeColor);
		await expect(active).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
		await active.focus();
		await expect(tint).toHaveCSS('opacity', '0');
		await expect(tint).toHaveCSS('transition-duration', '0s');
	});

	test(`corner theme updates controls and cards without layout changes: ${colorScheme}`, async ({
		page
	}) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await page.goto('/docs/theming');
		const card = page.locator('article [data-slot="card"]').first();
		const button = page
			.getByRole('navigation', { name: 'Primary' })
			.getByRole('link', { name: 'Docs', exact: true });
		await expect(card).toBeVisible();
		await expect(card).toHaveCSS('corner-shape', 'superellipse(3)');
		await expect(button).toHaveCSS('corner-shape', 'superellipse(3)');
		const before = await card.boundingBox();
		const radius = await card.evaluate((node) => getComputedStyle(node).borderRadius);
		await page.evaluate(() =>
			document.documentElement.style.setProperty('--corner-shape', 'bevel')
		);
		await expect(card).toHaveCSS('corner-shape', /^(bevel|superellipse\(0\))$/);
		await expect(button).toHaveCSS('corner-shape', /^(bevel|superellipse\(0\))$/);
		expect(await card.boundingBox()).toEqual(before);
		await expect(card).toHaveCSS('border-radius', radius);
		await card.evaluate((node) => node.style.setProperty('--corner-shape', 'round'));
		await expect(card).toHaveCSS('corner-shape', /^(round|superellipse\(1\))$/);
		await expect(button).toHaveCSS('corner-shape', /^(bevel|superellipse\(0\))$/);
		// Avatar circles opt out even when the root theme uses a non-round curve.
		await page
			.locator('[data-docs-navigation]')
			.getByRole('link', { name: 'Avatar', exact: true })
			.click();
		await expect(
			page.locator('main [data-slot="avatar"], article [data-slot="avatar"]').first()
		).toHaveCSS('corner-shape', /^(round|superellipse\(1\))$/);
	});
}
