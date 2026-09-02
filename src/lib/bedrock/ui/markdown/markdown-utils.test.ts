import { describe, expect, it } from 'vitest';
import {
	collectCitationNumbers,
	lexMarkdown,
	outlineFromMarkdown,
	slugify,
	splitCitations
} from './markdown-utils.js';

describe('slugify', () => {
	it('lowercases and replaces non-alphanumeric runs with single dashes', () => {
		expect(slugify('Hello, World!')).toBe('hello-world');
		expect(slugify('Getting  Started — Fast')).toBe('getting-started-fast');
	});

	it('trims leading and trailing dashes', () => {
		expect(slugify('  ...Setup...  ')).toBe('setup');
		expect(slugify('---')).toBe('');
	});
});

describe('outlineFromMarkdown', () => {
	it('extracts ids, plain-text labels, and levels', () => {
		const outline = outlineFromMarkdown('# Intro **bold**\n\n## Deep `code`');
		expect(outline).toEqual([
			{ id: 'intro-bold', label: 'Intro bold', level: 1 },
			{ id: 'deep-code', label: 'Deep code', level: 2 }
		]);
	});

	it('dedupes repeated slugs with -2, -3 within one document', () => {
		const outline = outlineFromMarkdown('# Setup\n\n## Setup\n\n### Setup');
		expect(outline.map((item) => item.id)).toEqual(['setup', 'setup-2', 'setup-3']);
	});

	it('applies headingLevelStart and clamps at 6', () => {
		const outline = outlineFromMarkdown('# A\n\n###### B', { headingLevelStart: 3 });
		expect(outline.map((item) => item.level)).toEqual([3, 6]);
	});
});

describe('citations', () => {
	const sources = { a: { title: 'Alpha' }, b: { title: 'Beta' } };

	it('numbers citations by first appearance across the document', () => {
		const tokens = lexMarkdown('See [b].\n\nThen [a], later [b] again and 【a】.');
		const numbers = collectCitationNumbers(tokens, sources);
		expect(numbers.get('b')).toBe(1);
		expect(numbers.get('a')).toBe(2);
		expect(numbers.size).toBe(2);
	});

	it('keeps non-matching brackets as literal text', () => {
		const segments = splitCitations('Match [a] but not [zz] or 【b】.', sources);
		expect(segments).toEqual([
			{ type: 'text', text: 'Match ' },
			{ type: 'citation', id: 'a' },
			{ type: 'text', text: ' but not [zz] or ' },
			{ type: 'citation', id: 'b' },
			{ type: 'text', text: '.' }
		]);
	});
});
