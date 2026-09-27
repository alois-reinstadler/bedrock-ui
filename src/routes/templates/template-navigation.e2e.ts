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
		await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
			'data-ready',
			'true'
		);
		for (const [title, slug] of [
			['Video Library', 'video-library'],
			['Email Client', 'email-client'],
			['Social Network', 'social-network'],
			['Music Player', 'music-player']
		]) {
			await page.getByRole('button', { name: 'Switch template' }).click();
			await page
				.getByRole('navigation', { name: 'Live templates' })
				.getByRole('link', { name: title, exact: true })
				.click();
			await expect(page).toHaveURL(new RegExp(`/templates/${slug}(?:/[^?]*)?$`));
			await page.getByRole('button', { name: 'Switch template' }).click();
			await expect(
				page
					.getByRole('navigation', { name: 'Live templates' })
					.getByRole('link', { name: title, exact: true })
			).toHaveAttribute('aria-current', 'page');
			await page.keyboard.press('Escape');
			await expect(page.locator('.template-screen')).not.toBeEmpty();
		}
		if (reducedMotion === 'reduce')
			await expect(page.locator('.template-screen')).toHaveCSS('view-transition-name', 'none');
		await page.getByRole('link', { name: 'Back to templates' }).click();
		await expect(page).toHaveURL(/\/docs\/templates#music-player$/);
		expect(errors).toEqual([]);
	});
}

for (const width of [390, 1440]) {
	test(`immersive previews and anchored gallery return: ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		for (const slug of ['music-player', 'video-library', 'email-client', 'social-network']) {
			await page.goto(`/templates/${slug}`);
			await expect(page.getByRole('region', { name: 'Template preview controls' })).toHaveAttribute(
				'data-ready',
				'true'
			);
			const screen = await page.locator('.template-screen').boundingBox();
			expect(screen?.x).toBe(0);
			expect(screen?.y).toBe(0);
			expect(screen?.width).toBe(await page.evaluate(() => document.documentElement.clientWidth));
			await expect(page.getByRole('link', { name: 'Bedrock home', exact: true })).toHaveCount(0);
			await page.getByRole('button', { name: 'Minimize preview controls' }).click();
			await expect(page.getByRole('link', { name: 'Back to templates' })).toHaveCount(0);
			await page.getByRole('button', { name: 'Show preview controls' }).click();
			await page.getByRole('link', { name: 'Back to templates' }).click();
			await expect(page).toHaveURL(new RegExp(`/docs/templates#${slug}$`));
			await expect(page.locator(`#${slug}`)).toBeInViewport();
		}
	});
}

const appPages = [
	['music-player', '/templates/music-player/library'],
	['email-client', '/templates/email-client/calendar'],
	['video-library', '/templates/video-library/my-list'],
	['social-network', '/templates/social-network/bookmarks']
] as const;

for (const [slug, destination] of appPages) {
	test(`${slug}: actual page routes preserve one shared picker`, async ({ page }) => {
		await page.goto(`/templates/${slug}`);
		const picker = page.getByRole('region', { name: 'Template preview controls' });
		await expect(picker).toHaveAttribute('data-ready', 'true');
		await picker.evaluate((node) => {
			node.setAttribute('data-instance-check', 'original');
		});
		await page.evaluate(() => {
			const original = document.startViewTransition.bind(document);
			document.startViewTransition = (...args) => {
				document.documentElement.dataset.wholePageTransition = 'started';
				return original(...args);
			};
		});
		const routeLink = page.locator(`a[href="${destination}"]`).filter({ visible: true }).first();
		await routeLink.click();
		await expect(page).toHaveURL(destination);
		await expect(picker).toHaveCount(1);
		await expect(picker).toHaveAttribute('data-instance-check', 'original');
		await expect(page.locator('html')).not.toHaveAttribute('data-whole-page-transition');
		await expect(picker.getByRole('link', { name: 'Back to templates' })).toHaveAttribute(
			'href',
			`/docs/templates#${slug}`
		);
		expect(
			await page
				.locator('.template-screen a[href]')
				.evaluateAll((links) =>
					links
						.map((link) => link.getAttribute('href'))
						.filter((href) => href && /[?&](?:view|screen|album|profile|thread)=/.test(href))
				)
		).toEqual([]);
		await page.reload();
		await expect(picker).toHaveAttribute('data-ready', 'true');
		await expect(page).toHaveURL(destination);
		await picker.getByRole('link', { name: 'Back to templates' }).click();
		await expect(page.locator(`#${slug}`)).toBeInViewport();
	});
}
