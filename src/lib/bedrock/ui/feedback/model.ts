import type { FeedbackAnnotation, FeedbackPayload, FeedbackTarget } from './types.js';
import { MAX_GROUP_ELEMENTS } from './target.js';

export const MAX_ANNOTATIONS = 200;
export const MAX_COMMENT = 4000;
export const MAX_TEXT_CHANGE = 4000;

function validTextChange(value: unknown): boolean {
	return (
		record(value) &&
		text(value.before, MAX_TEXT_CHANGE) &&
		value.before.trim().length > 0 &&
		text(value.after, MAX_TEXT_CHANGE) &&
		value.before !== value.after
	);
}

/** Deliberately omit credentials, query tokens and fragments from default capture. */
export function feedbackPage(url: string): string {
	try {
		const parsed = new URL(url);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return url.split(/[?#]/)[0];
	}
}

function record(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, max: number): value is string {
	return typeof value === 'string' && value.length <= max;
}

function number(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function annotation(value: unknown): value is FeedbackAnnotation {
	if (!record(value) || !record(value.target) || !record(value.viewport)) return false;
	const { target, viewport } = value;
	return (
		text(value.id, 100) &&
		value.id.length > 0 &&
		text(value.page, 4000) &&
		text(value.comment, MAX_COMMENT) &&
		(value.comment.trim().length > 0 || value.textChange !== undefined) &&
		(value.textChange === undefined ||
			(target.kind === 'element' && validTextChange(value.textChange))) &&
		(value.status === 'open' || value.status === 'resolved') &&
		text(value.createdAt, 40) &&
		Number.isFinite(Date.parse(value.createdAt)) &&
		text(value.updatedAt, 40) &&
		Number.isFinite(Date.parse(value.updatedAt)) &&
		number(viewport.width) &&
		number(viewport.height) &&
		number(viewport.pixelRatio) &&
		validTarget(target)
	);
}

function validTarget(target: unknown, member = false): target is FeedbackTarget {
	if (!record(target)) return false;
	const rect = target.rect;
	return (
		(member
			? target.kind === 'element'
			: ['element', 'page', 'group'].includes(String(target.kind))) &&
		(target.kind === 'group'
			? Array.isArray(target.elements) &&
				target.elements.length >= 2 &&
				target.elements.length <= MAX_GROUP_ELEMENTS &&
				target.elements.every((element) => validTarget(element, true)) &&
				new Set(target.elements.map((element) => element.selector)).size === target.elements.length
			: target.elements === undefined) &&
		text(target.selector, 4000) &&
		text(target.label, 240) &&
		text(target.text, 500) &&
		text(target.tag, 100) &&
		(rect === undefined ||
			(record(rect) &&
				typeof rect.x === 'number' &&
				Number.isFinite(rect.x) &&
				typeof rect.y === 'number' &&
				Number.isFinite(rect.y) &&
				number(rect.width) &&
				number(rect.height))) &&
		(target.styles === undefined ||
			(record(target.styles) &&
				Object.entries(target.styles).length <= 20 &&
				Object.entries(target.styles).every(
					([key, value]) => key.length <= 100 && text(value, 500)
				)))
	);
}

/** Storage is untrusted and versioned; invalid or duplicate records never enter the UI. */
export function parseFeedback(raw: string): FeedbackAnnotation[] {
	if (raw.length > 2_000_000) throw new Error('Draft storage is too large.');
	const parsed: unknown = JSON.parse(raw);
	if (
		!record(parsed) ||
		parsed.version !== 1 ||
		!Array.isArray(parsed.annotations) ||
		parsed.annotations.length > MAX_ANNOTATIONS ||
		!parsed.annotations.every(annotation) ||
		new Set(parsed.annotations.map((item) => item.id)).size !== parsed.annotations.length
	) {
		throw new Error('Draft storage is not a supported feedback document.');
	}
	return parsed.annotations;
}

const inline = (value: string) => value.replace(/[\r\n]+/g, ' ').replace(/`/g, '\\`');

/** Plain Markdown, never HTML. Customer comments are quoted as feedback, not agent instructions. */
export function feedbackMarkdown(payload: FeedbackPayload): string {
	return [
		`# Feedback — ${inline(payload.project)}`,
		...(payload.revision ? [`Revision: ${inline(payload.revision)}`] : []),
		'',
		...payload.annotations.flatMap((note, index) => [
			`## ${index + 1}. ${inline(note.target.label)} (${note.status})`,
			`Page: ${inline(note.page)}`,
			...(note.target.selector ? [`Element: \`${inline(note.target.selector)}\``] : []),
			`Viewport: ${note.viewport.width} × ${note.viewport.height} @ ${note.viewport.pixelRatio}x`,
			...(note.target.text ? [`Text: ${inline(note.target.text)}`] : []),
			...(note.target.styles
				? [
						`Styles: ${Object.entries(note.target.styles)
							.map(([key, value]) => `${key}: ${inline(value)}`)
							.join('; ')}`
					]
				: []),
			...(note.target.elements?.flatMap((element, member) => [
				`Element ${member + 1}: ${inline(element.label)} — \`${inline(element.selector)}\``,
				`Text: ${inline(element.text)}`,
				...(element.styles
					? [
							`Styles: ${Object.entries(element.styles)
								.map(([key, value]) => `${key}: ${inline(value)}`)
								.join('; ')}`
						]
					: [])
			]) ?? []),
			'',
			...(note.textChange
				? [
						'Original text:',
						...note.textChange.before.split('\n').map((line) => `> ${line}`),
						'',
						'Proposed text:',
						...(note.textChange.after === ''
							? ['> (remove text)']
							: note.textChange.after.split('\n').map((line) => `> ${line}`)),
						''
					]
				: []),
			...note.comment.split('\n').map((line) => `> ${line}`),
			''
		])
	].join('\n');
}
