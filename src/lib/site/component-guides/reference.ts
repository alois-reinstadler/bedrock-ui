import { semantics, keyboard } from './semantics';
import type { ComponentAccessibilityGuide, ComponentReference } from './types';

type Category = 'form' | 'layout' | 'overlay' | 'display' | 'navigation' | 'content' | 'data';

function baseAccessibility(category: Category): ComponentAccessibilityGuide {
	const semanticsByCategory: Record<Category, string> = {
		form: 'Preserve the native form-control role and state attributes exposed by each part.',
		layout: 'Layout-only wrappers must not introduce a role or alter the reading order.',
		overlay:
			'Use the documented trigger/content relationship and preserve the primitive’s modal semantics.',
		display:
			'Choose a live-region or status role only when content changes require an announcement.',
		navigation: 'Use native links and navigation landmarks for movement between destinations.',
		content: 'Keep the native document semantics represented by the component name and anatomy.',
		data: 'Expose the data structure, headers, names, and current values in a non-visual form.'
	};

	return {
		semantics: [semanticsByCategory[category]],
		keyboard: [
			'Native interactive descendants remain in the expected tab order; do not add positive tabindex values.',
			'Any application shortcut must supplement, rather than replace, the documented native interaction.'
		],
		focus: [
			'Keep the Bedrock focus-visible treatment unobscured and move focus only in response to a user action.',
			'When content is removed, return focus to a logical surviving control.'
		],
		labels: [
			'Every interactive element needs a programmatic name; visible text is preferred over aria-label.',
			'Associate instructions and errors with the control they describe instead of relying on proximity.'
		],
		announcements: [
			'The component does not announce ordinary visual changes unless its public anatomy documents a status or live region.',
			'Applications remain responsible for announcing asynchronous outcomes that happen outside the component.'
		],
		reducedMotion: [
			'Bedrock motion tokens reduce or remove non-essential movement when reduced motion is requested.',
			'Do not add consumer transitions that make state changes depend on animation.'
		]
	};
}

function buttonAccessibility(): ComponentAccessibilityGuide {
	return {
		semantics: [
			'Without href, Button renders a native button and defaults type to button to avoid accidental form submission.',
			'With href, Button renders a native anchor. A disabled link removes its destination and exposes aria-disabled.'
		],
		keyboard: [
			'Native buttons activate with Space and Enter. Link buttons activate with Enter.',
			'Do not add custom key handlers that cause an action to run twice.'
		],
		focus: [
			'Every enabled variant exposes a focus-visible outline with at least 3:1 contrast against its surroundings.',
			'Disabled link buttons are removed from the tab order; move focus before disabling the currently focused control.'
		],
		labels: [
			'Use a concise visible text label. Icon-only buttons require an aria-label describing the action.',
			'Loading buttons must retain the action name while exposing their busy state.'
		],
		announcements: [
			'Button does not announce action results. Report asynchronous success or failure in a nearby status region.',
			'Use aria-pressed only for a genuine toggle; use aria-expanded and aria-controls for disclosure triggers.'
		],
		reducedMotion: [
			'The one-pixel pressed translation is non-essential and must not be required to understand activation.',
			'Animated labels or spinners added by consumers must honor reduced motion while preserving a visible pending state.'
		],
		requirements: [
			{
				requirement: 'Text label',
				criteria: 'WCAG 1.4.3: Contrast (Minimum)',
				appliesTo: 'Rest, Hover, Pointer down',
				guidance:
					'Button text must have at least 4.5:1 contrast with the final composited button background in every state.'
			},
			{
				requirement: 'Essential icon or spinner arc',
				criteria: 'WCAG 1.4.11: Non-text Contrast',
				appliesTo: 'Icon only, Loading',
				guidance:
					'An icon used instead of text and the moving spinner arc need at least 3:1 contrast. An icon beside a visible label does not need a separate check.'
			},
			{
				requirement: 'Badge text',
				criteria: 'WCAG 1.4.3: Contrast (Minimum)',
				appliesTo: 'Rest, Hover, Pointer down',
				guidance:
					'Badge text needs at least 4.5:1 against its badge background. Badges are composed content, not a Button color prop. Audit all six built-in Badge variants in three states on page and surface backgrounds in both themes: 72 generated pairs (36 per theme). This is coverage, not a passing claim; the frozen tinted destructive Badge exception remains unresolved.'
			},
			{
				requirement: 'Visible control boundary',
				criteria: 'WCAG 1.4.11: Non-text Contrast',
				appliesTo: 'Rest',
				guidance:
					'The edge needs 3:1 contrast only when users need that boundary to identify the control. A text-only button can rely on its label.'
			},
			{
				requirement: 'Keyboard focus indicator',
				criteria: 'WCAG 1.4.11: Non-text Contrast',
				appliesTo: 'Focus visible',
				guidance:
					'The focus outline needs at least 3:1 contrast with the surrounding area for every style. The frozen destructive treatment uses tinted destructive border/ring colors; measure their final compositing rather than assuming solid red or a passing ratio.'
			},
			{
				requirement: 'Disabled appearance',
				criteria: 'WCAG 1.4.3 and 1.4.11',
				appliesTo: 'Disabled',
				guidance: 'Disabled controls are exempt from these contrast minimums.'
			}
		]
	};
}

export function createComponentReference(slug: string, category: Category): ComponentReference {
	const accessibility = slug === 'button' ? buttonAccessibility() : baseAccessibility(category);
	if (semantics[slug]) accessibility.semantics = [semantics[slug]];
	if (keyboard[slug]) accessibility.keyboard = [keyboard[slug]];
	if (['dialog', 'alert-dialog', 'drawer', 'sheet', 'lightbox'].includes(slug)) {
		accessibility.focus = [
			'On opening, focus moves inside the named dialog. Tab and Shift+Tab stay inside while modal; closing restores focus to the surviving trigger or a logical alternative.',
			'Verify the initial focus does not scroll important introductory text out of view. For destructive confirmation, prefer the least destructive action.'
		];
		accessibility.keyboard = [
			'Tab and Shift+Tab cycle through available controls. Verify the configured Escape behavior; an explicit cancel or close action remains reachable.'
		];
	}
	if (slug !== 'button')
		accessibility.requirements = [
			{
				requirement: 'Semantic contract',
				criteria: 'WCAG 4.1.2: Name, Role, Value',
				appliesTo: slug,
				guidance: accessibility.semantics[0]
			},
			{
				requirement: 'Keyboard operation',
				criteria: 'WCAG 2.1.1: Keyboard',
				appliesTo: 'Interactive descendants',
				guidance: accessibility.keyboard[0]
			},
			{
				requirement: 'Unobscured focus',
				criteria: 'WCAG 2.4.11: Focus Not Obscured (Minimum)',
				appliesTo: 'Keyboard focus',
				guidance: accessibility.focus[0]
			}
		];

	if (slug === 'badge') {
		accessibility.knownGaps = [
			'The tinted destructive Badge contrast exception is currently allowlisted in the frozen shadcn layer. Treat it as unresolved, not compliant.'
		];
	}
	if (slug === 'avatar') {
		accessibility.knownGaps = [
			'Avatar internals retain a frozen shadcn contrast exception. Supply meaningful adjacent identity text and do not treat the image alone as the accessible name.'
		];
	}
	if (slug === 'slider') {
		accessibility.knownGaps = [
			'bits-ui does not currently provide a complete thumb-labeling surface for every multi-thumb case. This remains an upstream decision; the Bedrock wrapper does not claim to solve it. Verify distinct names before shipping a multi-thumb interface.'
		];
	}

	return {
		api: [],
		accessibility
	};
}
