import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Representative surfaces: docs shell, one page per major new family group,
// and both demo compositions. Scans assert zero serious/critical violations;
// moderate/minor findings are reported in CI output without failing.
const routes = [
	'/',
	'/docs',
	'/docs/components',
	'/docs/components/text',
	'/docs/components/heading',
	'/docs/components/link',
	'/docs/components/markdown',
	'/docs/components/code-block',
	'/docs/components/token',
	'/docs/components/field-status',
	'/docs/components/number-input',
	'/docs/components/date-input',
	'/docs/components/file-input',
	'/docs/components/checkbox-list',
	'/docs/components/selector',
	'/docs/components/multi-selector',
	'/docs/components/tokenizer',
	'/docs/components/power-search',
	'/docs/components/color-picker',
	'/docs/components/async-button',
	'/docs/components/stepper',
	'/docs/components/metadata-list',
	'/docs/components/outline',
	'/docs/components/tabs',
	'/docs/components/data-table',
	'/docs/components/chat',
	'/docs/components/lightbox',
	'/docs/components/video-player',
	'/demo/erp',
	'/demo/chat'
];

async function scan(page: Page, route: string) {
	await page.goto(route);
	await page.waitForLoadState('networkidle');
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		// The docs sidebar search ships from the site shell on every page; its
		// findings would drown per-component signal. It is scanned via '/'.
		.analyze();
	// Known findings outside Bedrock's reach, filtered per node with an owner
	// note each (tracked in the expansion backlog):
	// - color-contrast on frozen shadcn markup: the Badge tinted-destructive
	//   variant (bg-destructive/10 + text-destructive) and the Avatar fallback
	//   glyph at size sm; both need an upstream/theme change.
	// - aria-input-field-name on the bits-ui Slider thumb input: the Bedrock
	//   Slider facade cannot reach the thumb to label it yet (site hero only).
	const allowedNode = (id: string, target: string) =>
		(id === 'color-contrast' &&
			(target.includes('bg-destructive') ||
				target.includes('avatar') ||
				// Bare bits-ui-generated ids point into frozen primitive internals
				// (here: the Avatar group count); Bedrock-owned text carries its
				// own class-based selectors and stays covered.
				target.startsWith('#bits-'))) ||
		(id === 'aria-input-field-name' && route === '/');
	const blocking = results.violations
		.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))
		.map((violation) => ({
			...violation,
			nodes: violation.nodes.filter((node) => !allowedNode(violation.id, node.target.join(' ')))
		}))
		.filter((violation) => violation.nodes.length > 0);
	const advisory = results.violations.filter(
		(violation) => !['critical', 'serious'].includes(violation.impact ?? '')
	);
	for (const violation of advisory) {
		console.warn(
			`[a11y advisory] ${route}: ${violation.id} (${violation.impact}) × ${violation.nodes.length}`
		);
	}
	expect(
		blocking.map((violation) => ({
			id: violation.id,
			impact: violation.impact,
			nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5)
		})),
		`serious/critical axe violations on ${route}`
	).toEqual([]);
}

for (const route of routes) {
	test(`axe: ${route}`, async ({ page }) => {
		await scan(page, route);
	});
}
