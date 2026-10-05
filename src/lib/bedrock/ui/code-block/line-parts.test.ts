import { describe, expect, it } from 'vitest';
import { codeLineParts } from './line-parts';

describe('code line emphasis', () => {
	it('splits syntax tokens at highlight boundaries without changing text or styles', () => {
		const line = {
			text: 'hello world',
			tokens: [
				{ text: 'hello ', style: '--shiki-light:red' },
				{ text: 'world', style: '--shiki-light:blue' }
			]
		};
		const parts = codeLineParts(line, [{ start: 3, end: 8 }]);
		expect(parts.map((part) => part.text).join('')).toBe(line.text);
		expect(parts.filter((part) => part.highlighted)).toEqual([
			{ text: 'lo ', style: '--shiki-light:red', highlighted: true },
			{ text: 'wo', style: '--shiki-light:blue', highlighted: true }
		]);
	});

	it('handles overlapping, invalid, and out-of-bounds ranges on plain text', () => {
		const parts = codeLineParts({ text: '<tag>' }, [
			{ start: -1, end: 3 },
			{ start: 1, end: 50 },
			{ start: NaN, end: 2 }
		]);
		expect(parts.map((part) => part.text).join('')).toBe('<tag>');
		expect(parts.every((part) => part.highlighted)).toBe(true);
		expect(codeLineParts({ text: '' }, [])).toEqual([]);
	});
});
