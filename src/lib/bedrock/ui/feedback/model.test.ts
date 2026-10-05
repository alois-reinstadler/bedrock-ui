import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Feedback from './feedback.svelte';
import { feedbackMarkdown, feedbackPage, parseFeedback } from './model.js';
import type { FeedbackAnnotation } from './types.js';

const note: FeedbackAnnotation = {
	id: 'note-1',
	page: 'https://example.com/about',
	comment: 'Use the new title.\nKeep the subtitle.',
	status: 'open',
	createdAt: '2026-09-29T00:00:00.000Z',
	updatedAt: '2026-09-29T00:00:00.000Z',
	viewport: { width: 1280, height: 800, pixelRatio: 1 },
	target: {
		kind: 'element',
		selector: '[data-feedback-id="hero"]',
		label: 'Hero',
		text: 'Original title',
		tag: 'h1'
	}
};

describe('Feedback persistence and export contract', () => {
	it('roundtrips text-only suggestions and quotes both versions in exports', () => {
		const suggestion = {
			...note,
			comment: '',
			textChange: { before: 'Original title', after: 'New title\nSecond line' }
		};
		const annotations = parseFeedback(JSON.stringify({ version: 1, annotations: [suggestion] }));
		expect(annotations[0].textChange).toEqual(suggestion.textChange);
		const markdown = feedbackMarkdown({ version: 1, project: 'Review', annotations });
		expect(markdown).toContain('Original text:\n> Original title');
		expect(markdown).toContain('Proposed text:\n> New title\n> Second line');
		expect(
			parseFeedback(
				JSON.stringify({
					version: 1,
					annotations: [{ ...suggestion, textChange: { before: 'Remove me', after: '' } }]
				})
			)
		).toHaveLength(1);
		for (const textChange of [
			null,
			{ before: '', after: 'New' },
			{ before: 'Same', after: 'Same' },
			{ before: 'Old', after: 7 },
			{ before: 'Old', after: 'x'.repeat(4001) }
		]) {
			expect(() =>
				parseFeedback(JSON.stringify({ version: 1, annotations: [{ ...suggestion, textChange }] }))
			).toThrow();
		}
		expect(() =>
			parseFeedback(
				JSON.stringify({
					version: 1,
					annotations: [{ ...suggestion, target: { ...suggestion.target, kind: 'page' } }]
				})
			)
		).toThrow();
	});
	it('roundtrips grouped targets and exports each member with its context', () => {
		const group = {
			...note,
			target: {
				...note.target,
				kind: 'group',
				selector: '',
				label: '2 elements',
				elements: [
					note.target,
					{ ...note.target, selector: '#subtitle', label: 'Subtitle', styles: { color: 'red' } }
				]
			}
		};
		const annotations = parseFeedback(JSON.stringify({ version: 1, annotations: [group] }));
		expect(annotations[0].target.elements).toHaveLength(2);
		const markdown = feedbackMarkdown({ version: 1, project: 'Grouped review', annotations });
		expect(markdown).toContain('Element 1: Hero');
		expect(markdown).toContain('Element 2: Subtitle — `#subtitle`');
		expect(markdown).toContain('Styles: color: red');
		for (const elements of [
			[],
			[note.target],
			[note.target, note.target],
			[{ ...note.target, kind: 'group', elements: [note.target] }, note.target],
			Array.from({ length: 51 }, (_, index) => ({ ...note.target, selector: `#item-${index}` }))
		]) {
			expect(() =>
				parseFeedback(
					JSON.stringify({
						version: 1,
						annotations: [{ ...group, target: { ...group.target, elements } }]
					})
				)
			).toThrow();
		}
	});
	it('omits credentials, query strings and fragments from automatic page identities', () => {
		expect(feedbackPage('https://user:password@example.com/about?token=secret#private')).toBe(
			'https://example.com/about'
		);
		expect(feedbackPage('/about?token=secret')).toBe('/about');
	});
	it('roundtrips versioned drafts including resolved notes', () => {
		expect(
			parseFeedback(
				JSON.stringify({
					version: 1,
					annotations: [note, { ...note, id: 'note-2', status: 'resolved' }]
				})
			)
		).toHaveLength(2);
	});
	it('rejects corrupt, future-version, duplicate and malformed storage', () => {
		for (const value of [
			'{',
			JSON.stringify({ version: 2, annotations: [] }),
			JSON.stringify({ version: 1, annotations: [note, note] }),
			JSON.stringify({ version: 1, annotations: [{ ...note, comment: ' ' }] }),
			JSON.stringify({ version: 1, annotations: [{ ...note, viewport: null }] }),
			JSON.stringify({
				version: 1,
				annotations: [{ ...note, target: { ...note.target, styles: { color: {} } } }]
			})
		]) {
			expect(() => parseFeedback(value)).toThrow();
		}
	});
	it('retains page, element, revision and multiline feedback in a portable export', () => {
		const markdown = feedbackMarkdown({
			version: 1,
			project: 'Client site',
			revision: 'build-7',
			annotations: [note]
		});
		expect(markdown).toContain('Revision: build-7');
		expect(markdown).toContain('Page: https://example.com/about');
		expect(markdown).toContain('[data-feedback-id="hero"]');
		expect(markdown).toContain('> Use the new title.\n> Keep the subtitle.');
	});
	it('renders safely on the server without browser APIs or a launcher', () => {
		expect(render(Feedback).body).not.toContain('feedback-launcher');
	});
});
