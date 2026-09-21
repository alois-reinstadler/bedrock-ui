import { expect, test } from '@playwright/test';

test('rapid accordion reversals settle at natural height under fourfold CPU slowdown', async ({
	page,
	context
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/docs/components/accordion');
	const trigger = page.getByRole('button', { name: 'What should I bring?' });
	await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	const session = await context.newCDPSession(page);
	await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
	try {
		const result = await trigger.evaluate(async (element) => {
			const button = element as HTMLButtonElement;
			const item = button.closest('[data-slot="accordion-item"]')!;
			const heights: number[] = [];
			const intervals: number[] = [];
			let previous = performance.now();
			const frame = async () => {
				await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
				const now = performance.now();
				intervals.push(now - previous);
				previous = now;
				heights.push(
					item.querySelector('[data-slot="accordion-content"]')?.getBoundingClientRect().height ?? 0
				);
			};
			// Every new intent interrupts the previous transition before its normal duration.
			for (let input = 0; input < 8; input++) {
				button.click();
				for (let sample = 0; sample < 3; sample++) await frame();
			}
			for (let sample = 0; sample < 60; sample++) await frame();
			const panel = item.querySelector<HTMLElement>('[data-slot="accordion-content"]')!;
			return {
				heights,
				intervals,
				natural: panel.firstElementChild!.getBoundingClientRect().height,
				actual: panel.getBoundingClientRect().height,
				transform: getComputedStyle(panel.firstElementChild!).transform,
				running: panel
					.getAnimations({ subtree: true })
					.filter((animation) => animation.playState === 'running').length,
				expanded: button.getAttribute('aria-expanded')
			};
		});
		await test.info().attach('fourfold-cpu-accordion-frames', {
			body: JSON.stringify(result),
			contentType: 'application/json'
		});
		expect(result.expanded).toBe('true');
		expect(result.heights.some((height) => height > 1 && height < result.natural - 1)).toBe(true);
		expect(Math.abs(result.actual - result.natural)).toBeLessThan(1);
		expect(result.heights.slice(-5).every((height) => Math.abs(height - result.natural) < 1)).toBe(
			true
		);
		expect(result.transform).toBe('none');
		expect(result.running).toBe(0);
		expect(errors).toEqual([]);
	} finally {
		await session.send('Emulation.setCPUThrottlingRate', { rate: 1 });
		await session.detach();
	}
});

test('repeated navigation releases observer targets and pending route controls', async ({
	page
}) => {
	test.setTimeout(60_000);
	const warnings: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'warning') warnings.push(message.text());
	});
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.addInitScript(() => {
		const targets = new Map<object, Set<Node>>();
		for (const Observer of [ResizeObserver, MutationObserver]) {
			const prototype = Observer.prototype;
			const observe = prototype.observe;
			const disconnect = prototype.disconnect;
			Object.defineProperty(prototype, 'observe', {
				value: function (this: object, node: Node, options: never) {
					const nodes = targets.get(this) ?? new Set<Node>();
					nodes.add(node);
					targets.set(this, nodes);
					return observe.call(this as never, node as Element, options);
				}
			});
			Object.defineProperty(prototype, 'disconnect', {
				value: function (this: object) {
					targets.delete(this);
					return disconnect.call(this as never);
				}
			});
		}
		const unobserve = ResizeObserver.prototype.unobserve;
		ResizeObserver.prototype.unobserve = function (node) {
			targets.get(this)?.delete(node);
			return unobserve.call(this, node);
		};
		Object.assign(window, {
			polishObserverCounts: () => {
				const nodes = [...targets.values()].flatMap((set) => [...set]);
				return {
					connected: nodes.filter((node) => node.isConnected).length,
					detached: nodes.filter((node) => !node.isConnected).length
				};
			}
		});
	});
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/docs/components/accordion');
	const navigation = page.locator('[data-docs-navigation]');
	await expect(page.locator('#preview [data-slot="accordion-trigger"]').first()).toBeVisible();
	const original = await navigation.elementHandle();
	const counts = () =>
		page.evaluate(() =>
			(
				window as unknown as { polishObserverCounts: () => { connected: number; detached: number } }
			).polishObserverCounts()
		);
	await expect.poll(async () => (await counts()).detached).toBe(0);
	const samples: { connected: number; detached: number }[] = [];
	for (let cycle = 0; cycle < 4; cycle++) {
		await navigation.locator('a[href="/docs/components/scroll-area"]').click();
		const area = page.locator('[data-blur-examples] [data-edge-blur="both"]');
		await expect(area).toHaveAttribute('data-scroll-bottom-hidden', 'true');
		await area
			.locator('[data-slot="scroll-area-viewport"]')
			.evaluate((node) => node.scrollTo(70, 50));
		await expect(area).toHaveAttribute('data-scroll-top-hidden', 'true');
		await navigation.locator('a[href="/docs/components/async-button"]').click();
		const pending = page.locator('#preview [data-slot="async-button"]').nth(cycle % 2);
		await pending.click();
		await expect(pending).toHaveAttribute('data-state', 'pending');
		const oldButton = await pending.elementHandle();
		await navigation.locator('a[href="/docs/components/accordion"]').click();
		await expect(page.locator('#preview [data-slot="accordion-trigger"]').first()).toBeVisible();
		await expect.poll(() => oldButton!.evaluate((node) => node.isConnected)).toBe(false);
		await expect.poll(async () => (await counts()).detached).toBe(0);
		expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
		samples.push(await counts());
		await oldButton!.dispose();
	}
	// Both real preview actions settle after 1200ms; include the last detached action's result.
	await page.waitForTimeout(1250);
	expect(await counts()).toEqual(samples[0]);
	await test.info().attach('observer-target-counts', {
		body: JSON.stringify({ samples, warnings }),
		contentType: 'application/json'
	});
	expect(samples.every((sample) => sample.connected === samples[0].connected)).toBe(true);
	await expect(page.locator('[data-docs-navigation]')).toHaveCount(1);
	await expect(page.locator('[data-slot="docs-active-highlight"]')).toHaveCount(1);
	expect(errors).toEqual([]);
	await original!.dispose();
});
