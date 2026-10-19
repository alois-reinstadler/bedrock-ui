import type { ComponentGuides } from './types';

export const feedbackGuides = {
	feedback: {
		purpose:
			'Feedback lets developers and customer reviewers attach actionable notes to elements on a live page. Bedrock owns its implementation, annotation format and visual language.',
		useWhen: [
			'Reviewing a website with element-specific changes.',
			'Capturing structured developer feedback for a coding agent.',
			'Embedding an optional review tool with application-owned storage.'
		],
		avoidWhen: [
			'A general support conversation belongs in your support channel.',
			'This component is not a hosted review service or an authorization system.'
		],
		anatomy: [
			{
				name: 'Feedback',
				description:
					'A compact draggable toolbar, element picker, contextual note composer, page pins and notes preview. Root is an alias.',
				required: true
			}
		],
		behavior: [
			'Customer reviewers can select a plain-text element and choose Edit text on page. Save retains original and proposed copy as textChange; save, cancel and close restore the page. Nested markup and groups use normal notes.',
			'Selection outlines and note panels resize smoothly. Drawing a selection box stays immediate, and reduced-motion preferences disable interpolation.',
			'Open the toolbar and press I to inspect or pause. Notes open beside the selected target. Enter saves, Shift+Enter adds a line, and Escape cancels. Shortcuts are ignored while editing page inputs.',
			'Preview notes opens the review list. The eye toggles markers, C copies feedback, and Settings contains JSON export and delivery. Drag the toolbar handle or use its arrow keys to reposition it.',
			'Choose Select element, then click a target or hold the left mouse button and drag a box. Fully enclosed elements become one group note; enclosing a parent includes its contents without duplicate children. Groups support up to 50 elements.',
			'Developer mode includes element selectors and a small computed-style snapshot. Review mode presents plain-language feedback controls.',
			'Notes are grouped by page. Pass pageUrl from your router to handle client-side navigation; the default omits query strings and fragments.',
			'Use data-feedback-id for stable anchors and data-feedback-ignore to exclude sensitive sections. Form values and editable content are excluded from automatic text capture.',
			'Browser drafts are opt-in through storageKey. Keep the key stable while mounted and remount when changing projects or reviewers. Without storageKey, notes last only for the mounted session.',
			'Copy and JSON export include all saved pages. onSubmit adds Send feedback and must reject if delivery fails. The application supplies authentication, project permissions and shared storage.',
			'Page notes provide a keyboard-accessible alternative to pointing. While selecting, Tab to an interactive target and press Enter or Space. Escape cancels selection or closes the active surface.',
			'Changed structural targets are marked as unavailable instead of putting their pin on an unrelated element. Original element context stays with the note.',
			'This first version does not capture screenshots, selected text ranges, iframe contents, source file mappings or discussion threads. Top-layer modal annotation and animation tracking are not yet supported.'
		],
		examplePlan: [
			{
				title: 'Customer and developer review',
				demonstrates:
					'Select elements, save and edit notes, resolve and reopen feedback, switch modes, and export local drafts.',
				priority: 'primary'
			}
		]
	}
} satisfies ComponentGuides;
