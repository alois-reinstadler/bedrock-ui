import { expect, test } from '@playwright/test';

test('async button preserves natural geometry through pending and failed result', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/docs/components/async-button');
	const example = page
		.getByRole('heading', { name: 'Save notification preferences', exact: true })
		.locator('../..');
	const button = example.locator('[data-slot="async-button"]');
	await expect(button).toBeVisible();
	await button.focus();

	const pending = await button.evaluate(async (element) => {
		const button = element as HTMLButtonElement;
		const samples: { width: number; height: number; transform: string }[] = [];
		button.click();
		const start = performance.now();
		do {
			const rect = button.getBoundingClientRect();
			const currentCopy = button.querySelector('[data-slot="swap"]')?.lastElementChild;
			samples.push({
				width: rect.width,
				height: rect.height,
				transform: currentCopy ? getComputedStyle(currentCopy).transform : 'none'
			});
			await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
		} while (performance.now() - start < 650);
		return samples;
	});

	await expect(button).toBeFocused();
	expect(pending.length).toBeGreaterThan(3);
	const widths = pending.map((sample) => sample.width);
	await test
		.info()
		.attach('pending-geometry', { body: JSON.stringify(pending), contentType: 'application/json' });
	for (let index = 1; index < widths.length; index++) {
		expect(widths[index]).toBeGreaterThanOrEqual(widths[index - 1] - 1);
	}
	expect(Math.max(...widths) - Math.min(...widths)).toBeGreaterThan(10);
	expect(widths.some((width) => width > widths[0] + 1 && width < widths.at(-1)! - 1)).toBe(true);
	expect(
		Math.max(...pending.map((sample) => sample.height)) -
			Math.min(...pending.map((sample) => sample.height))
	).toBeLessThan(1);
	expect(pending.every((sample) => sample.transform === 'none')).toBe(true);

	await expect(button).toHaveAttribute('data-state', 'error');
	await expect
		.poll(() => button.evaluate((node) => node.getAnimations({ subtree: true }).length))
		.toBe(0);
	const settled = await button.evaluate((element) => {
		const shell = element.querySelector('[data-slot="swap"]')!.parentElement!;
		const copy = shell.cloneNode(true) as HTMLElement;
		copy.style.position = 'absolute';
		copy.style.width = 'max-content';
		copy.style.visibility = 'hidden';
		shell.parentElement!.append(copy);
		const natural = copy.getBoundingClientRect().width;
		copy.remove();
		return { shellWidth: shell.getBoundingClientRect().width, natural };
	});
	expect(Math.abs(settled.shellWidth - settled.natural)).toBeLessThan(1);
	await expect(button).toBeFocused();
	await expect(button).toHaveAttribute('data-state', 'idle', { timeout: 5000 });
	await expect(example.getByRole('checkbox')).toBeChecked();
});
