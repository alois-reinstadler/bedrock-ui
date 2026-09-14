import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

test('records composited text contrast across variants, states, surfaces and themes', async ({
	page
}) => {
	test.setTimeout(180_000);
	await page.goto('/demo/contrast');
	await expect(page.locator('#fixture')).toHaveAttribute('data-ready', 'true');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.addStyleTag({
		content: '*, *::before, *::after { transition: none !important; animation: none !important; }'
	});
	const results: Array<{
		id: string;
		theme: string;
		state: string;
		ratio: number;
		meetsAA: boolean;
	}> = [];
	for (const theme of ['light', 'dark']) {
		await page.evaluate(
			(dark) => document.documentElement.classList.toggle('dark', dark),
			theme === 'dark'
		);
		// Allow the theme controller and registered color properties to settle.
		await page.waitForTimeout(350);
		for (const element of await page.locator('[data-contrast]').all()) {
			for (const state of ['rest', 'hover', 'pointer-down']) {
				await page.mouse.move(0, 0);
				if (state !== 'rest') await element.hover();
				if (state === 'pointer-down') await page.mouse.down();
				await page.waitForTimeout(200);
				const sample = await element.evaluate((node) => {
					const canvas = document.createElement('canvas');
					canvas.width = canvas.height = 1;
					const context = canvas.getContext('2d')!;
					function rgba(color: string): number[] {
						context.clearRect(0, 0, 1, 1);
						context.fillStyle = color;
						context.fillRect(0, 0, 1, 1);
						return [...context.getImageData(0, 0, 1, 1).data].map((value) => value / 255);
					}
					function over(foreground: number[], background: number[]) {
						return foreground
							.slice(0, 3)
							.map(
								(value, index) => value * foreground[3] + background[index] * (1 - foreground[3])
							);
					}
					const ancestors: Element[] = [];
					for (let parent: Element | null = node; parent; parent = parent.parentElement)
						ancestors.unshift(parent);
					let background = [1, 1, 1];
					for (const ancestor of ancestors)
						background = over(rgba(getComputedStyle(ancestor).backgroundColor), background);
					const foreground = over(rgba(getComputedStyle(node).color), background);
					function luminance(channels: number[]) {
						const linear = channels.map((value) =>
							value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
						);
						return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
					}
					const a = luminance(foreground);
					const b = luminance(background);
					return {
						id: node.getAttribute('data-contrast')!,
						ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
					};
				});
				if (state === 'pointer-down') {
					await page.mouse.move(0, 0);
					await page.mouse.up();
				}
				results.push({ ...sample, theme, state, meetsAA: sample.ratio >= 4.5 });
			}
		}
	}
	const directory = 'docs/bedrock/site-expansion';
	await mkdir(directory, { recursive: true });
	await writeFile(
		`${directory}/contrast-results.json`,
		`${JSON.stringify(
			{
				method:
					'Computed CSS colors converted to sRGB through canvas; alpha composited through ancestor solid backgrounds. Text AA diagnostic, not a complete accessibility conformance test.',
				badgePairs: results.filter((row) => row.id.startsWith('badge')).length,
				buttonPairs: results.filter((row) => row.id.startsWith('button')).length,
				failures: results.filter((row) => !row.meetsAA),
				results
			},
			null,
			2
		)}\n`
	);
	expect(results).toHaveLength(144);
	expect(results.every((row) => Number.isFinite(row.ratio) && row.ratio >= 1)).toBe(true);
});
