import { expect, test } from './shared-browser';

test('drawer exits without returning to its open position', async ({ page }) => {
	await page.goto('/docs/components/drawer');
	const trigger = page.getByRole('button', { name: 'Open drawer', exact: true });
	for (let cycle = 0; cycle < 3; cycle++) {
		await trigger.click();
		const drawer = page.locator('[data-slot="drawer-content"]');
		await expect(drawer).toBeVisible();
		await drawer.evaluate(async (node) => {
			await Promise.all(node.getAnimations().map((animation) => animation.finished));
		});
		const frames = await drawer.evaluate(async (node) => {
			const positions: number[] = [];
			(node.querySelector('button') as HTMLButtonElement).click();
			const started = performance.now();
			while (node.isConnected && performance.now() - started < 1200) {
				positions.push(node.getBoundingClientRect().top);
				await new Promise(requestAnimationFrame);
			}
			return positions;
		});
		expect(frames.length).toBeGreaterThan(2);
		for (let i = 1; i < frames.length; i++)
			expect(frames[i]).toBeGreaterThanOrEqual(frames[i - 1] - 1);
		await expect(drawer).toHaveCount(0);
		await expect(trigger).toBeFocused();
	}
});

test('PDF keeps a document skeleton until its first page is rendered', async ({ page }) => {
	let release!: () => void;
	const gate = new Promise<void>((resolve) => {
		release = resolve;
	});
	await page.route('**/demo/beleg.pdf', async (route) => {
		await gate;
		await route.continue();
	});
	try {
		await page.goto('/docs/components/pdf-viewer');
		const viewer = page.locator('[data-slot="pdf-viewer"]').first();
		await expect(viewer).toHaveAttribute('aria-busy', 'true');
		await expect(viewer.getByRole('status')).toContainText('Loading PDF');
		expect(await viewer.locator('[data-slot="skeleton"]').count()).toBeGreaterThan(5);
		await expect(viewer.locator('canvas')).toHaveCount(0);
		release();
		await expect(viewer).toHaveAttribute('aria-busy', 'false', { timeout: 20000 });
		await expect(viewer.locator('canvas').first()).toBeVisible();
		await expect(viewer.locator('[data-slot="pdf-viewer-loading"]')).toHaveCount(0);
	} finally {
		release();
	}
});

test('PDF replaces its skeleton with an error when the document fails', async ({ page }) => {
	await page.route('**/demo/beleg.pdf', (route) => route.fulfill({ status: 404, body: 'Missing' }));
	await page.goto('/docs/components/pdf-viewer');
	const viewer = page.locator('[data-slot="pdf-viewer"]').first();
	await expect(viewer.getByRole('alert')).toHaveText('Could not load PDF.');
	await expect(viewer).toHaveAttribute('aria-busy', 'false');
	await expect(viewer.locator('[data-slot="pdf-viewer-loading"]')).toHaveCount(0);
});

test('mobile stepper stays within its card and updates the current stage', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/docs/components/stepper');
	const stepper = page.getByRole('list', { name: 'Order progress' });
	await expect(stepper).toBeVisible();
	expect(await stepper.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await expect(stepper.locator('[aria-current="step"]')).toContainText('Shipped');
	await expect(page.getByRole('heading', { name: 'On its way to you' })).toBeVisible();
});

test('drawer releases its enter animation so drag dismissal still works', async ({ page }) => {
	await page.goto('/docs/components/drawer');
	await page.getByRole('button', { name: 'Open drawer', exact: true }).click();
	const drawer = page.locator('[data-slot="drawer-content"]');
	await expect(drawer).toBeVisible();
	await drawer.evaluate(async (node) => {
		await Promise.all(node.getAnimations().map((animation) => animation.finished));
	});
	await page.waitForTimeout(550); // Vaul's gesture guard ignores presses immediately after opening.
	const box = (await drawer.boundingBox())!;
	await page.mouse.move(box.x + box.width / 2, box.y + 18);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width / 2, box.y + 18 + box.height * 0.6, { steps: 12 });
	await expect.poll(async () => (await drawer.boundingBox())!.y).toBeGreaterThan(box.y + 20);
	await page.mouse.up();
	await expect(drawer).toHaveCount(0);
});
