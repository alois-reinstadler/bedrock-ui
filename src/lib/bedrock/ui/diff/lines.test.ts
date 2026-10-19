import { describe, expect, it } from 'vitest';
import { createDiff, splitDiff, diffSections, inlineChanges } from './lines';

describe('diff lines', () => {
	it('preserves context and numbers each source independently', () => {
		const lines = createDiff('a\nb\nz\n', 'a\nx\ny\nz\n');
		expect(lines.map(({ kind, before, after }) => [kind, before, after])).toEqual([
			['unchanged', 1, 1],
			['removed', 2, undefined],
			['added', undefined, 2],
			['added', undefined, 3],
			['unchanged', 3, 4]
		]);
		const rows = splitDiff(lines);
		expect(rows[1].before?.text).toBe('b');
		expect(rows[1].after?.text).toBe('x');
		expect(rows[2].before).toBeUndefined();
		expect(rows[3].before?.text).toBe('z');
		expect(rows[3].after?.text).toBe('z');
	});

	it('handles empty files, blank lines, and missing final newlines', () => {
		expect(createDiff('', '')).toEqual([]);
		expect(createDiff('', '\n')).toMatchObject([{ kind: 'added', text: '', after: 1 }]);
		expect(createDiff('a\n', '')).toMatchObject([{ kind: 'removed', before: 1 }]);
		expect(createDiff('a', 'a\n')).toMatchObject([
			{ kind: 'removed', noNewline: true },
			{ kind: 'added', noNewline: false }
		]);
	});

	it('normalizes CRLF but preserves meaningful whitespace and repeated lines', () => {
		expect(createDiff('a\r\n', 'a\n').map((line) => line.kind)).toEqual(['unchanged']);
		expect(createDiff(' a\n', 'a\n').map((line) => line.kind)).toEqual(['removed', 'added']);
		for (const [before, after] of [
			['a\na\nb', 'a\nb\nb'],
			['\n\nx\n', '\ny\n']
		]) {
			const lines = createDiff(before, after);
			for (const [side, source] of [
				['before', before],
				['after', after]
			] as const) {
				expect(
					lines
						.filter((line) => line[side] != null)
						.map((line) => line.text + (line.noNewline ? '' : '\n'))
						.join('')
				).toBe(source);
			}
		}
	});
});

describe('diff hunks and word changes', () => {
	it('merges nearby changes and calculates hunk offsets after insertions', () => {
		const before = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join('\n');
		const after = before.replace('line 3\n', 'line 3\nextra\n').replace('line 15', 'updated 15');
		const sections = diffSections(createDiff(before, after), 1);
		expect(
			sections.filter((section) => section.kind === 'lines').map((section) => section.header)
		).toEqual(['@@ -3,2 +3,3 @@', '@@ -14,3 +15,3 @@']);
		expect(sections.flatMap((section) => section.lines)).toEqual(createDiff(before, after));
		expect(
			sections
				.filter((section) => section.kind === 'gap')
				.every((section) => section.lines.every((line) => line.kind === 'unchanged'))
		).toBe(true);
		expect(diffSections(createDiff(before, after), null)).toHaveLength(1);
		expect(diffSections(createDiff(before, before), 3)).toHaveLength(1);
	});

	it('preserves zero-length ranges for pure insertion and deletion hunks', () => {
		const inserted = diffSections(createDiff('a\nb\n', 'x\na\nb\n'), 0);
		expect(inserted[0].header).toBe('@@ -0,0 +1,1 @@');
		const removed = diffSections(createDiff('x\na\nb\n', 'a\nb\n'), 0);
		expect(removed[0].header).toBe('@@ -1,1 +0,0 @@');
	});

	it('marks only edited words and respects whitespace and UTF-16 offsets', () => {
		const lines = createDiff(
			'const icon = "😀"; const version = 10;\n',
			'const icon = "😀"; const version = 11;\n'
		);
		const ranges = inlineChanges(lines);
		expect(
			ranges.get(lines[0])?.map((range) => lines[0].text.slice(range.start, range.end))
		).toEqual(['10']);
		expect(
			ranges.get(lines[1])?.map((range) => lines[1].text.slice(range.start, range.end))
		).toEqual(['11']);
		expect(inlineChanges(createDiff('', 'added\n')).size).toBe(0);
	});
});
