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
			'Verify that every enabled variant has a visible keyboard focus indicator with at least 3:1 contrast against the final composited surroundings in both themes; this is a test obligation, not a measured passing claim.',
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

function steppedFormAccessibility(): ComponentAccessibilityGuide {
	return {
		semantics: [
			'Root renders one native form. Stepper communicates progress; Stepped Form coordinates validation, navigation, focus, and submission. Do not nest forms inside Step.',
			'Every Step requires its matching stable definition ID and a Title. The section uses an instance-unique aria-labelledby relationship to that h2; preserve the generated title ID and the hidden, inert, and aria-hidden attributes.',
			'Inactive sections stay mounted, preserving entered values. They are hidden and inert and must remain outside the tab order and accessibility tree; their named controls still contribute to FormData unless separately disabled.'
		],
		keyboard: [
			'Previous and Next are native type=button controls; Submit is type=submit. Keep these types intact. Native implicit submission, such as Enter in a single-line field, advances before the final step and submits on the final step; Enter in a textarea still inserts a newline.',
			'Forward navigation validates the current section; Previous preserves values without validating. Navigation and submission lock during async operations. Verify keyboard progress controls obey linear or completed-predecessor restrictions and any canNavigate guard.',
			'Tab and Shift+Tab must reach only the active section and shared controls. Do not add positive tabindex values or custom key handlers that submit twice.'
		],
		focus: [
			'Committed navigation focuses the new step Title with tabindex=-1 and preventScroll. Verify that the heading remains visible at mobile widths and browser zoom; the application must resolve any sticky-header or scroll-container obstruction.',
			'Native constraints run before the step validator. Invalid results focus the supplied field or selector within that section, then the first aria-invalid/native-invalid field, or the step heading when no field is available. Keep returned targets focusable and inside their panel.',
			'Final submission validates every enabled section. A failure in an inactive section reveals it before focusing the invalid field. Verify this sequence with keyboard and a screen reader.',
			'Removing or disabling the current step falls back to the first enabled step, but does not perform a navigation commit or rewrite the parent value. The application must repair focus and announce such structural changes; duplicate step IDs are unsupported.'
		],
		labels: [
			'Use a durable visible label for every field and a descriptive Title for every Step. Progress has the default name Form progress; provide a more specific label when multiple forms appear.',
			'Consumers own field-level aria-invalid, error IDs, aria-describedby relationships, and corrective error text. A root validation summary does not automatically label or mark an individual field.',
			'Associate relevant instructions and the Step Description with the controls that need them; proximity to a field is not a programmatic relationship.'
		],
		announcements: [
			'Place Status outside conditional or inactive sections and keep it mounted. Its polite, atomic live region reports step number and title, validation, submission, success, and errors; Root exposes aria-busy during pending work.',
			'Check that validation summaries and submission outcomes are announced once without unnecessarily moving focus. A failed operation exposes Retry; retrying a server mutation still requires application-owned idempotency.',
			'An absent onSubmit callback reports local success without saving anything. Provide actual submission behavior and truthful outcome messages; do not interpret the demo success state as persisted data.'
		],
		reducedMotion: [
			'Active steps use a short directional entrance. Under prefers-reduced-motion: reduce, the component removes the animation. Verify the computed animation and focus sequence remain correct in both directions.',
			'Consumer transitions must not delay access to the new heading, fields, errors, or status. Motion preference support is supplemental to the AA requirements; WCAG 2.3.3 is Level AAA.'
		],
		requirements: [
			{
				requirement: 'Section and label relationships',
				criteria: 'WCAG 1.3.1: Info and Relationships',
				appliesTo: 'Every step; multiple form instances',
				guidance:
					'Verify each section references its own existing Title, every field has an associated label, and multiple instances never share generated heading IDs.'
			},
			{
				requirement: 'Keyboard operation',
				criteria: 'WCAG 2.1.1: Keyboard',
				appliesTo: 'Forward, back, progress, submit, retry',
				guidance:
					'Complete the flow without a pointer; inactive fields cannot receive Tab focus and pending work prevents duplicate actions. Enter must advance or submit without bypassing validation.'
			},
			{
				requirement: 'Focus order and error recovery',
				criteria: 'WCAG 2.4.3: Focus Order',
				appliesTo: 'Step changes and final validation',
				guidance:
					'Verify navigation focuses the new heading, a hidden failing section is revealed before its invalid field receives focus, and removing a focused step has an application-managed recovery path.'
			},
			{
				requirement: 'Unobscured focus',
				criteria: 'WCAG 2.4.11: Focus Not Obscured (Minimum)',
				appliesTo: 'Mobile widths, zoom, sticky headers',
				guidance:
					'Verify that focused headings and fields are not entirely covered by sticky content. Heading focus uses preventScroll, so test the surrounding page scroll behavior explicitly.'
			},
			{
				requirement: 'Error identification',
				criteria: 'WCAG 3.3.1: Error Identification',
				appliesTo: 'Native, async, and server validation',
				guidance:
					'Errors identify the affected field and problem in text; consumers connect field error IDs and aria-invalid. Root status alone does not establish these relationships.'
			},
			{
				requirement: 'Labels and instructions',
				criteria: 'WCAG 3.3.2: Labels or Instructions',
				appliesTo: 'Required fields and format constraints',
				guidance:
					'Explain required input and formats before submission using visible labels and associated instructions. Do not rely on placeholders or a progress label to name controls.'
			},
			{
				requirement: 'Status messages',
				criteria: 'WCAG 4.1.3: Status Messages',
				appliesTo: 'Checking, submitting, success, error, retry',
				guidance:
					'Keep Status mounted and verify polite atomic announcements of actual outcomes. Report persisted success only after application submission resolves successfully.'
			},
			{
				requirement: 'Reduced-motion preference',
				criteria: 'WCAG 2.3.3: Animation from Interactions (AAA)',
				appliesTo: 'Directional entrances',
				guidance:
					'Emulate reduced motion and verify forward and backward step changes have no entrance animation while remaining immediately usable.'
			},
			{
				requirement: 'Text and control contrast',
				criteria: 'WCAG 1.4.3 and 1.4.11',
				appliesTo: 'Both themes; error text, actions, progress states',
				guidance:
					'Measure rendered text and required control/focus indicators against their actual backgrounds. Theme tokens and shared Button primitives are not evidence of a passing contrast ratio.'
			}
		],
		knownGaps: [
			'This JavaScript coordination component does not provide a no-JavaScript multi-step flow. Supply a single-page native form fallback when that access path is required. Preserve Root novalidate and use its onSubmit callback; do not spread a remote-form enhancement over its submit handler.',
			'Parent writes to the bindable value are trusted programmatic navigation and do not run per-step guards, announce a committed step, or focus its heading. Final validation still runs; applications own focus and announcements for controlled external changes.',
			'Persistence restores a step once in the browser and writes committed step IDs. It does not persist field values or listen for popstate; bind parent state for routing and implement draft retention separately. Restoring a step never bypasses final validation.',
			'Use unique stable step IDs and keep at least one enabled section. Dynamic removal falls back to the first enabled step without rewriting an invalid external value; applications must handle focus and announcements when the enabled sequence changes.',
			'Async freshness checks discard stale UI results when the form, active ID, enabled sequence, or disabled state changes. They cannot cancel an already-dispatched server mutation. Consumers own authorization, validation on the server, idempotency, and truthful persistence feedback.'
		]
	};
}

export function createComponentReference(slug: string, category: Category): ComponentReference {
	if (slug === 'stepped-form') return { api: [], accessibility: steppedFormAccessibility() };
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
