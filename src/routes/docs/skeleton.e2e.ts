import { expect, test } from '../../../scripts/shared-browser-test';
import type { Locator } from '@playwright/test';

async function sampleSharedSweep(group: Locator, time = 1000) {
	return group.evaluate(async (root, time) => {
		const animation = root.getAnimations()[0];
		if (!animation) throw new Error('Missing shared sweep');
		animation.pause();
		await animation.ready;
		animation.currentTime = time;
		const bounds = root.getBoundingClientRect();
		const style = getComputedStyle(root);
		return {
			progress: Number(style.getPropertyValue('--bedrock-skeleton-progress')),
			width: bounds.width,
			height: bounds.height,
			background: style.backgroundImage,
			items: [...root.querySelectorAll<HTMLElement>('[data-skeleton-grouped]')].map((node) => {
				const box = node.getBoundingClientRect();
				const style = getComputedStyle(node);
				return {
					x: box.left - bounds.left,
					y: box.top - bounds.top,
					originX: box.left - bounds.left + parseFloat(style.backgroundPositionX),
					originY: box.top - bounds.top + parseFloat(style.backgroundPositionY),
					width: box.width,
					imageWidth: parseFloat(style.backgroundSize),
					animations: node.getAnimations().length
				};
			})
		};
	}, time);
}

function expectAligned(sample: Awaited<ReturnType<typeof sampleSharedSweep>>) {
	expect(sample.background).toBe('none');
	expect(sample.items).toHaveLength(6);
	for (const item of sample.items) {
		expect(item.originX).toBeCloseTo(sample.items[0].originX, 2);
		expect(item.originY).toBeCloseTo(sample.items[0].originY, 2);
		expect(item.imageWidth).toBeCloseTo(sample.width * 2.5, 2);
		expect(item.animations).toBe(0);
	}
}

for (const colorScheme of ['light', 'dark'] as const) {
	for (const reducedMotion of ['no-preference', 'reduce'] as const) {
		test(`skeleton variants respect motion preference: ${colorScheme}, ${reducedMotion}`, async ({
			page
		}) => {
			await page.emulateMedia({ colorScheme, reducedMotion });
			await page.goto('/docs/components/skeleton');
			const preview = page.locator('[data-skeleton-variants]');
			await expect(preview).toBeVisible();
			if (reducedMotion === 'reduce') {
				const placeholders = preview.locator('[data-slot="skeleton"]');
				await expect(placeholders).toHaveCount(18);
				for (const placeholder of await placeholders.all()) {
					await expect(placeholder).toHaveAttribute('data-variant', 'static');
					await expect(placeholder).toHaveCSS('animation-name', 'none');
					await expect(placeholder).toHaveCSS('background-image', 'none');
				}
				const group = preview.locator('[data-shared-preview]');
				await expect(group).toHaveAttribute('data-variant', 'static');
				await expect(group).toHaveCSS('animation-name', 'none');
				await expect(group.locator('[data-skeleton-grouped]')).toHaveCount(0);
				expect(await preview.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(
					0
				);
				return;
			}
			for (const [variant, name] of [
				['pulse', 'pulse'],
				['shimmer', 'bedrock-skeleton-shimmer'],
				['static', 'none']
			]) {
				const placeholder = preview.locator(`[data-variant="${variant}"]`).first();
				await expect(placeholder).toHaveCSS('animation-name', name);
				if (variant === 'static') {
					expect(await placeholder.evaluate((node) => node.getAnimations().length)).toBe(0);
					continue;
				}
				await expect(placeholder).toHaveCSS('animation-duration', '2s');
				const samples = await placeholder.evaluate(async (node) => {
					const animation = node.getAnimations()[0];
					if (!animation) throw new Error('Missing skeleton animation');
					animation.pause();
					await animation.ready;
					const sample = (time: number) => {
						animation.currentTime = time;
						const style = getComputedStyle(node);
						return {
							opacity: Number(style.opacity),
							position: style.backgroundPosition,
							image: style.backgroundImage,
							width: node.getBoundingClientRect().width,
							height: node.getBoundingClientRect().height
						};
					};
					const result = [sample(0), sample(1000)];
					animation.play();
					return result;
				});
				if (variant === 'pulse') {
					expect(samples[0].opacity).toBe(1);
					expect(samples[1].opacity).toBe(0.5);
				} else {
					expect(samples[0].image).not.toBe('none');
					expect(samples[0].position).not.toBe(samples[1].position);
				}
				expect(samples[0].width).toBe(samples[1].width);
				expect(samples[0].height).toBe(samples[1].height);
			}
			const group = preview.locator('[data-shared-preview]');
			await expect(group).toHaveCSS('animation-name', 'bedrock-skeleton-group');
			await expect(group.locator('[data-skeleton-grouped]').first()).toHaveCSS(
				'background-size',
				/px/
			);
			const early = await sampleSharedSweep(group, 500);
			const later = await sampleSharedSweep(group, 1500);
			expectAligned(early);
			expectAligned(later);
			expect(early.progress).toBeCloseTo(0.25);
			expect(later.progress).toBeCloseTo(0.75);
			expect(later.items[0].originX).toBeGreaterThan(early.items[0].originX);
			expect(new Set(early.items.map((item) => item.width)).size).toBeGreaterThan(2);
			expect(new Set(early.items.map((item) => item.x)).size).toBeGreaterThan(1);
			expect(new Set(early.items.map((item) => item.y)).size).toBeGreaterThan(2);
		});
	}
}

test('changing variants and loading state preserves geometry and keyboard focus', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/components/skeleton');
	const example = page.locator('#examples');
	const select = example.getByLabel('Animation');
	await select.focus();
	const first = example.locator('[data-slot="skeleton"]').first();
	const original = await first.boundingBox();
	for (const variant of ['static', 'pulse', 'shimmer']) {
		await select.selectOption(variant);
		await expect(example.locator(`[data-slot="skeleton"][data-variant="${variant}"]`)).toHaveCount(
			6
		);
		await expect(select).toBeFocused();
		expect(await first.boundingBox()).toEqual(original);
	}
	await select.press('Home');
	await select.press('ArrowDown');
	await expect(select).toHaveValue('shimmer');
	await expect(first).toHaveAttribute('data-variant', 'shimmer');
	const toggle = example.getByRole('button', { name: 'Show loaded content' });
	await toggle.focus();
	await toggle.press('Enter');
	await expect(example.locator('[data-slot="skeleton"]')).toHaveCount(0);
	await expect(example.locator('div[aria-busy]')).toHaveAttribute('aria-busy', 'false');
	await expect(example.getByRole('button', { name: 'Show loading state' })).toBeFocused();
	await expect(example.getByRole('status').filter({ hasText: /teammates loaded/ })).toHaveText(
		'2 teammates loaded.'
	);
	await page.keyboard.press('Enter');
	await expect(example.locator('[data-slot="skeleton"][data-variant="shimmer"]')).toHaveCount(6);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	expect(errors).toEqual([]);
});

test('shared shimmer keeps alignment through resizing and descendant layout changes', async ({
	page
}) => {
	await page.goto('/docs/components/skeleton');
	const group = page.locator('[data-shared-preview]');
	await expect(group).toBeVisible();
	for (const width of [1280, 390, 900]) {
		await page.setViewportSize({ width, height: 900 });
		await expect
			.poll(async () => {
				const sample = await sampleSharedSweep(group);
				return Math.abs(sample.items[0].imageWidth - sample.width * 2.5);
			})
			.toBeLessThan(0.01);
		expectAligned(await sampleSharedSweep(group));
	}
	await group.evaluate((node) => {
		node.style.gap = '29px';
		node.style.padding = '17px';
		node.style.border = '3px solid transparent';
	});
	await expect
		.poll(async () => {
			const sample = await sampleSharedSweep(group);
			return Math.max(
				...sample.items.map((item) => Math.abs(item.originX - sample.items[0].originX))
			);
		})
		.toBeLessThan(0.01);
	expectAligned(await sampleSharedSweep(group));
	await group.evaluate((node) => node.setAttribute('dir', 'rtl'));
	await expect
		.poll(async () => {
			const sample = await sampleSharedSweep(group);
			return Math.max(
				...sample.items.map((item) => Math.abs(item.originX - sample.items[0].originX))
			);
		})
		.toBeLessThan(0.01);
	expectAligned(await sampleSharedSweep(group));
});

test('group controls change speed and direction and release animations when content loads', async ({
	page
}) => {
	await page.goto('/docs/components/skeleton');
	const example = page.locator('#examples');
	const group = example.locator('[data-slot="skeleton-group"]');
	await expect(group).toBeVisible();
	await example.getByLabel('Sweep speed').selectOption('3200');
	await example.getByLabel('Sweep direction').selectOption('rtl');
	await expect(group).toHaveCSS('animation-duration', '3.2s');
	await expect(group).toHaveCSS('animation-direction', 'reverse');
	const early = await sampleSharedSweep(group, 800);
	const late = await sampleSharedSweep(group, 2400);
	expectAligned(early);
	expectAligned(late);
	expect(late.items[0].originX).toBeLessThan(early.items[0].originX);
	await example.getByLabel('Animation', { exact: true }).selectOption('static');
	await expect(group).toHaveCSS('animation-name', 'none');
	await expect(group.locator('[data-skeleton-grouped]')).toHaveCount(0);
	expect(await group.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0);
	await example.getByLabel('Animation', { exact: true }).selectOption('shimmer');
	await expect(group.locator('[data-skeleton-grouped]')).toHaveCount(6);
	await expect(group).toHaveCSS('animation-duration', '3.2s');
	await example.getByRole('button', { name: 'Show loaded content' }).click();
	await expect(group).toHaveCount(0);
	expect(
		await example
			.locator('div[aria-busy]')
			.evaluate((node) => node.getAnimations({ subtree: true }).length)
	).toBe(0);
});

test('PDF loading uses a static placeholder under reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	let release!: () => void;
	const pending = new Promise<void>((resolve) => (release = resolve));
	await page.route('**/demo/beleg.pdf*', async (route) => {
		await pending;
		await route.continue();
	});
	try {
		await page.goto('/docs/components/pdf-viewer', { waitUntil: 'domcontentloaded' });
		const viewer = page.locator('#preview [data-slot="pdf-viewer"]').first();
		const placeholder = viewer.locator('[data-slot="skeleton"]');
		await expect(placeholder.first()).toBeVisible();
		const count = await placeholder.count();
		await expect
			.poll(() =>
				placeholder.evaluateAll((nodes) =>
					nodes.map((node) => ({
						variant: node.getAttribute('data-variant'),
						animation: getComputedStyle(node).animationName,
						animations: node
							.getAnimations()
							.map((animation) => ({
								type: animation.constructor.name,
								state: animation.playState
							}))
					}))
				)
			)
			.toEqual(
				Array.from({ length: count }, () => ({
					variant: 'static',
					animation: 'none',
					animations: []
				}))
			);
		release();
		await expect(viewer.locator('canvas').first()).toBeVisible();
		await expect(viewer.locator('[data-slot="skeleton"]')).toHaveCount(0);
	} finally {
		release();
	}
});
