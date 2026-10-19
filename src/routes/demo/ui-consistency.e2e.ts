import { expect, test, type Page } from '../../../scripts/shared-browser-test';

async function expectViewportFit(page: Page) {
	try {
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
			.toBeLessThanOrEqual(1);
	} catch (error) {
		await test.info().attach('overflow-elements', {
			body: JSON.stringify(
				await page.evaluate(() => ({
					width: innerWidth,
					elements: [...document.querySelectorAll('body *')]
						.filter((node) => {
							const box = node.getBoundingClientRect();
							if (
								!box.width ||
								!box.height ||
								box.right <= innerWidth + 1 ||
								getComputedStyle(node).visibility === 'hidden'
							)
								return false;
							for (let parent = node.parentElement; parent; parent = parent.parentElement) {
								if (
									getComputedStyle(parent).overflowX !== 'visible' &&
									parent.getBoundingClientRect().right <= innerWidth + 1
								)
									return false;
							}
							return true;
						})
						.slice(0, 40)
						.map((node) => ({
							tag: node.tagName,
							class: node.getAttribute('class'),
							text: node.textContent?.slice(0, 80),
							right: node.getBoundingClientRect().right
						}))
				}))
			),
			contentType: 'application/json'
		});
		throw error;
	}
}

for (const route of ['/demo/erp', '/demo/motion/continuity', '/demo/motion-test']) {
	test(`${route} keeps content reachable on narrow screens`, async ({ page }) => {
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await page.setViewportSize({ width: 390, height: 900 });
		await page.goto(route);
		for (const width of [390, 320, 768]) {
			await page.setViewportSize({ width, height: 900 });
			for (const theme of ['light', 'dark']) {
				await page.evaluate((theme) => {
					document.documentElement.classList.toggle('dark', theme === 'dark');
				}, theme);
				await expectViewportFit(page);
			}
		}

		await page.setViewportSize({ width: 390, height: 900 });
		if (route === '/demo/erp') {
			const table = page.locator('[data-slot="data-table"]');
			const search = table.getByRole('searchbox', { name: 'Tabelle durchsuchen' });
			await search.fill('no-matching-audit-order');
			await expect(table.getByText('Keine Ergebnisse.')).toBeVisible();
			await search.clear();
			await expect(table.locator('tbody tr').first()).toBeVisible();
			await page
				.getByRole('heading', { name: 'Attachments', exact: true })
				.scrollIntoViewIfNeeded();
		} else if (route === '/demo/motion/continuity') {
			await page.getByRole('button', { name: 'Label ändern', exact: true }).click();
			await page.getByRole('button', { name: 'Nächster Monat', exact: true }).click();
			await page.getByRole('button', { name: 'Dynamischen Inhalt öffnen', exact: true }).click();
			await expect(
				page.getByText('Asynchroner Inhalt ist während der Offenlegung eingetroffen.', {
					exact: false
				})
			).toBeVisible();
		} else {
			await page.getByRole('button', { name: '100 Knoten', exact: true }).click();
			await expect(page.getByTestId('stress-root')).toHaveAttribute('data-count', '100');
			await page.getByRole('button', { name: 'Raster umschalten', exact: true }).click();
			const viewport = page
				.getByRole('region', { name: 'Bewegungsraster', exact: true })
				.locator('[data-slot="scroll-area-viewport"]');
			await viewport.focus();
			await page.keyboard.press('ArrowRight');
			await expect.poll(() => viewport.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
			await expect(page.getByTestId('stress-root')).toHaveCSS('width', '552px');
		}
		await expectViewportFit(page);
		expect(errors).toEqual([]);
		await test
			.info()
			.attach('mobile-dark', { body: await page.screenshot(), contentType: 'image/png' });
	});
}
