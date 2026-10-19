import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '../../scripts/shared-browser-test';

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
		.analyze();
	// No component, route or generated-ID exemptions: every serious finding
	// must be fixed at its owner rather than hidden by the audit.
	const blocking = results.violations.filter((violation) =>
		['critical', 'serious'].includes(violation.impact ?? '')
	);
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

for (const colorScheme of ['light', 'dark'] as const) {
	for (const route of [
		'/docs/components/badge',
		'/docs/components/avatar',
		'/docs/components/data-table',
		'/demo/erp'
	]) {
		test(`${colorScheme} contrast regression: ${route}`, async ({ page }) => {
			await page.emulateMedia({ colorScheme });
			await scan(page, route);
		});
	}
}
