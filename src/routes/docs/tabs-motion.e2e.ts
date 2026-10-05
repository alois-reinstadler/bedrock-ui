import { expect, test } from '../../../scripts/shared-browser-test';

for (const orientation of ['horizontal', 'vertical'] as const) {
	for (const variant of ['default', 'line']) {
		test(`${variant} ${orientation} tabs share one surface through interrupted selection`, async ({
			page
		}) => {
			await page.emulateMedia({ reducedMotion: 'no-preference' });
			await page.goto('/docs/components/tabs');
			const list = page.getByRole('tablist', { name: `${variant} ${orientation} example` });
			await list.scrollIntoViewIfNeeded();
			const indicator = list.locator('[data-slot="tabs-indicator"]');
			await expect(indicator).toBeVisible();
			const travel = await list.evaluate(async (root, orientation) => {
				const mark = root.querySelector<HTMLElement>('[data-slot="tabs-indicator"]')!;
				const tabs = root.querySelectorAll<HTMLButtonElement>('[role="tab"]');
				const axis = orientation === 'horizontal' ? 'x' : 'y';
				await document.fonts.ready;
				await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
				await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
				const start = mark.getBoundingClientRect()[axis];
				tabs[2].click();
				const samples: number[] = [];
				const started = performance.now();
				let interrupted = false;
				do {
					await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
					samples.push(mark.getBoundingClientRect()[axis]);
					if (!interrupted && performance.now() - started > 80) {
						tabs[1].click();
						interrupted = true;
					}
				} while (performance.now() - started < 650);
				const final = mark.getBoundingClientRect();
				const target = tabs[1].getBoundingClientRect();
				return {
					start,
					samples,
					connected: mark.isConnected,
					error: Math.max(
						Math.abs(final.x - target.x),
						Math.abs(final.y - target.y),
						Math.abs(final.width - target.width),
						Math.abs(final.height - target.height)
					),
					pseudo: {
						content: getComputedStyle(mark, '::after').content,
						width: getComputedStyle(mark, '::after').width,
						height: getComputedStyle(mark, '::after').height
					},
					triggerUnderline: getComputedStyle(tabs[1], '::after').opacity
				};
			}, orientation);
			expect(travel.connected).toBe(true);
			expect(travel.samples.some((value) => Math.abs(value - travel.start) > 2)).toBe(true);
			expect(new Set(travel.samples.map((value) => Math.round(value))).size).toBeGreaterThan(3);
			expect(travel.error).toBeLessThan(1);
			expect(travel.triggerUnderline).toBe('0');
			if (variant === 'line') {
				expect(travel.pseudo.content).toBe('""');
				expect(orientation === 'horizontal' ? travel.pseudo.height : travel.pseudo.width).toBe(
					'2px'
				);
			}
			await expect(indicator).toHaveCount(1);
			await list.getByRole('tab', { name: 'Activity log' }).focus();
			await page.keyboard.press(orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown');
			await expect(list.getByRole('tab', { name: 'Crew' })).toHaveAttribute(
				'aria-selected',
				'true'
			);
		});
	}
}

test('tab indicators stay aligned with borders and scrolling and settle under reduced motion', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/docs/components/tabs');
	const list = page.getByRole('tablist', { name: 'line horizontal example' });
	await list.evaluate((root) => {
		root.style.cssText =
			'width: 140px; justify-content: start; overflow: auto; border: 3px solid transparent';
		root
			.querySelectorAll<HTMLElement>('[role="tab"]')
			.forEach((tab) => (tab.style.flex = '0 0 110px'));
	});
	await list.getByRole('tab', { name: 'Crew' }).click();
	await expect
		.poll(() =>
			list.evaluate((root) => {
				const mark = root.querySelector<HTMLElement>('[data-slot="tabs-indicator"]')!;
				const tab = root.querySelector<HTMLElement>('[aria-selected="true"]')!;
				return Math.abs(mark.getBoundingClientRect().x - tab.getBoundingClientRect().x);
			})
		)
		.toBeLessThan(1);
	await expect(list.locator('[data-slot="tabs-indicator"]')).toHaveCSS('transition-duration', '0s');
	await expect(list.getByRole('tab', { name: 'Crew' })).toHaveAttribute('aria-selected', 'true');
});
