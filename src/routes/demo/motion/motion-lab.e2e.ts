import { expect, test, type Page } from '@playwright/test';

const routes = [
	'/demo/motion',
	'/demo/motion/foundations',
	'/demo/motion/components',
	'/demo/motion/continuity',
	'/demo/motion/concurrency',
	'/demo/motion/accessibility'
];

function collectDiagnostics(page: Page) {
	const errors: string[] = [];
	const failedRequests: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('requestfailed', (request) => failedRequests.push(request.url()));
	return { errors, failedRequests };
}

test('all Motion Lab pages render their benchmarks without runtime failures', async ({ page }) => {
	const diagnostics = collectDiagnostics(page);

	for (const route of routes) {
		await page.goto(route);
		await expect(page.getByRole('heading', { name: 'Motion Lab', exact: true })).toBeVisible();
		await expect(page.getByRole('navigation', { name: 'Motion-Lab-Bereiche' })).toBeVisible();
		if (route !== '/demo/motion') {
			const benchmarks = page.locator('[data-testid^="benchmark-"]');
			expect(await benchmarks.count()).toBeGreaterThanOrEqual(4);
			await expect(benchmarks.first().locator('details')).toContainText('Technische Motion-Daten');
		}
	}

	expect(diagnostics.errors).toEqual([]);
	expect(diagnostics.failedRequests).toEqual([]);
});

test('global inspection controls persist and change the lab policy', async ({ page }) => {
	await page.goto('/demo/motion/foundations');
	const shell = page.locator('.motion-lab');

	await page.getByRole('button', { name: '4-fache Zeitlupe' }).click();
	await expect(page.getByRole('button', { name: '4-fache Zeitlupe' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	expect(
		await shell.evaluate((node) =>
			getComputedStyle(node).getPropertyValue('--lab-time-scale').trim()
		)
	).toBe('4');

	await page.getByRole('button', { name: 'Reduziert', exact: true }).click();
	await expect(shell).toHaveAttribute('data-motion-preference', 'reduced');
	await page.getByRole('button', { name: 'Pause', exact: true }).click();
	await expect(shell).toHaveAttribute('data-paused', 'true');
	await page.getByRole('button', { name: 'Zurücksetzen' }).click();
	await expect(shell).toHaveAttribute('data-motion-preference', 'normal');
	await expect(shell).toHaveAttribute('data-paused', 'false');
});

test('hard-case component and continuity scenarios settle in their latest state', async ({
	page
}) => {
	const diagnostics = collectDiagnostics(page);
	await page.goto('/demo/motion/components');

	const controls = page.locator('[data-testid="benchmark-control-states"]');
	await controls.getByRole('button', { name: 'Schnell toggeln' }).click();
	await page.waitForTimeout(700);
	await expect(controls.getByText(/Switch (aktiv|inaktiv)/)).toBeVisible();

	const many = page.locator('[data-testid="benchmark-many-controls"]');
	await many.getByRole('button', { name: 'Alle umschalten' }).dblclick({ delay: 45 });
	await expect(many.getByRole('switch')).toHaveCount(30);

	await page.goto('/demo/motion/continuity');
	const tabs = page.locator('[data-testid="benchmark-tabs-continuity"]');
	await tabs.getByRole('button', { name: 'Signal', exact: true }).last().click();
	await tabs
		.getByRole('button', { name: /Abschlussbericht/ })
		.last()
		.click();
	await tabs
		.getByRole('button', { name: /Betrieb/ })
		.last()
		.click();
	await expect(tabs.getByRole('button', { name: /Betrieb/ }).last()).toHaveAttribute(
		'aria-pressed',
		'true'
	);

	expect(diagnostics.errors).toEqual([]);
	expect(diagnostics.failedRequests).toEqual([]);
});

test('interruptibility, no-motion, reduced loops, and scale probes are operable', async ({
	page
}) => {
	await page.goto('/demo/motion/concurrency');
	const interrupt = page.locator('[data-testid="benchmark-interruptibility-lab"]');
	await interrupt.getByRole('button', { name: 'Stress-Sequenz' }).click();
	await expect(interrupt.locator('.interrupt-track')).toHaveAttribute('data-target', 'b', {
		timeout: 1_500
	});
	await expect(interrupt.getByText('Switch B/C')).toBeVisible();

	const restraint = page.locator('[data-testid="benchmark-should-this-animate"]');
	await restraint.getByRole('button', { name: '10 Updates' }).click();
	await expect(restraint).toContainText('Bewusst instant');

	await page.goto('/demo/motion/accessibility');
	await page.getByRole('button', { name: 'Reduziert', exact: true }).click();
	const continuous = page.locator('[data-testid="benchmark-continuous-motion"]');
	const loopState = await continuous
		.locator('.lab-loop')
		.first()
		.evaluate((node) => {
			return getComputedStyle(node).animationName;
		});
	expect(loopState).toBe('none');

	const performance = page.locator('[data-testid="benchmark-performance-scale"]');
	await performance.getByRole('button', { name: '1-s-Probe starten' }).click();
	await expect(performance.getByText('Max gap')).toBeVisible({ timeout: 2_000 });
	await expect(performance.getByText('Frames')).toBeVisible();
});

test('the reduced lab preference also disables low-level CSS disclosure transitions', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/demo/motion/continuity');
	await page.getByRole('button', { name: 'Reduziert', exact: true }).click();
	const disclosure = page.locator('.dynamic-disclosure');
	await disclosure.getByRole('button', { name: 'Dynamischen Inhalt öffnen' }).click();
	await expect(disclosure.getByText('Der erste Absatz ist sofort vorhanden.')).toBeVisible();
	// Inspect the element that owns cssTransition. The sibling native Button
	// legitimately retains color/press transitions when the OS allows motion.
	const entrance = await disclosure.locator('.dynamic-copy').evaluate((node) => {
		const surface = node.parentElement!;
		return {
			opacity: getComputedStyle(surface).opacity,
			running: surface.getAnimations().filter((animation) => animation.playState === 'running')
				.length
		};
	});
	expect(entrance).toEqual({ opacity: '1', running: 0 });
	await disclosure.getByRole('button', { name: 'Dynamischen Inhalt schließen' }).click();
	await expect(disclosure.locator('.dynamic-copy')).toHaveCount(0);
});
