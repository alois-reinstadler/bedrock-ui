import { diffLines, diffWordsWithSpace } from 'diff';
import type { CodeHighlightRange } from '../code-block/line-parts';

export type DiffLine = {
	kind: 'unchanged' | 'added' | 'removed';
	text: string;
	before?: number;
	after?: number;
	noNewline: boolean;
};

/** Preserve whitespace and EOF changes, normalizing only CRLF line endings. */
export function createDiff(before: string, after: string): DiffLine[] {
	const oldText = before.replaceAll('\r\n', '\n');
	const newText = after.replaceAll('\r\n', '\n');
	// Bound pathological edit searches; a full replacement still preserves both inputs.
	const changes = diffLines(oldText, newText, { maxEditLength: 1000 }) ?? [
		{ value: oldText, removed: true, added: false },
		{ value: newText, removed: false, added: true }
	];
	let oldNumber = 1;
	let newNumber = 1;
	return changes.flatMap((change) => {
		if (!change.value) return [];
		const lines = change.value.split('\n');
		const terminated = lines.at(-1) === '';
		if (terminated) lines.pop();
		return lines.map((text, index) => ({
			kind: change.added ? 'added' : change.removed ? 'removed' : 'unchanged',
			text,
			before: change.added ? undefined : oldNumber++,
			after: change.removed ? undefined : newNumber++,
			noNewline: !terminated && index === lines.length - 1
		}));
	});
}

/** Pair adjacent replacement blocks without shifting subsequent unchanged lines. */
export function splitDiff(lines: DiffLine[]): { before?: DiffLine; after?: DiffLine }[] {
	const rows: { before?: DiffLine; after?: DiffLine }[] = [];
	let index = 0;
	while (index < lines.length) {
		if (lines[index].kind === 'unchanged') {
			rows.push({ before: lines[index], after: lines[index++] });
			continue;
		}
		const removed: DiffLine[] = [];
		const added: DiffLine[] = [];
		while (index < lines.length && lines[index].kind !== 'unchanged') {
			const line = lines[index++];
			(line.kind === 'removed' ? removed : added).push(line);
		}
		for (let i = 0; i < Math.max(removed.length, added.length); i++) {
			rows.push({ before: removed[i], after: added[i] });
		}
	}
	return rows;
}

export type DiffSection = {
	kind: 'lines' | 'gap';
	start: number;
	lines: DiffLine[];
	header?: string;
};

/** Keep nearby context and merge overlapping change windows into Git-style hunks. */
export function diffSections(lines: DiffLine[], context: number | null): DiffSection[] {
	if (
		context === null ||
		!Number.isFinite(context) ||
		!lines.some((line) => line.kind !== 'unchanged')
	) {
		return [{ kind: 'lines', start: 0, lines }];
	}
	const count = Math.max(0, Math.floor(context));
	const windows: { start: number; end: number }[] = [];
	for (let index = 0; index < lines.length; index++) {
		if (lines[index].kind === 'unchanged') continue;
		const start = Math.max(0, index - count);
		const end = Math.min(lines.length, index + count + 1);
		const previous = windows.at(-1);
		if (previous && start <= previous.end) previous.end = end;
		else windows.push({ start, end });
	}
	const sections: DiffSection[] = [];
	let cursor = 0;
	for (const window of windows) {
		if (cursor < window.start)
			sections.push({ kind: 'gap', start: cursor, lines: lines.slice(cursor, window.start) });
		sections.push({
			kind: 'lines',
			start: window.start,
			lines: lines.slice(window.start, window.end)
		});
		cursor = window.end;
	}
	if (cursor < lines.length)
		sections.push({ kind: 'gap', start: cursor, lines: lines.slice(cursor) });
	if (sections.length === 1) return sections;
	let oldOffset = 0;
	let newOffset = 0;
	for (const section of sections) {
		const oldCount = section.lines.filter((line) => line.before != null).length;
		const newCount = section.lines.filter((line) => line.after != null).length;
		if (section.kind === 'lines') {
			section.header = `@@ -${oldOffset + (oldCount ? 1 : 0)},${oldCount} +${newOffset + (newCount ? 1 : 0)},${newCount} @@`;
		}
		oldOffset += oldCount;
		newOffset += newCount;
	}
	return sections;
}

/** Highlight changed words within paired replacement lines, preserving whitespace offsets. */
export function inlineChanges(lines: DiffLine[]): Map<DiffLine, CodeHighlightRange[]> {
	const ranges = new Map<DiffLine, CodeHighlightRange[]>();
	for (const { before, after } of splitDiff(lines)) {
		if (before?.kind !== 'removed' || after?.kind !== 'added') continue;
		const changes = diffWordsWithSpace(before.text, after.text, { maxEditLength: 500 });
		if (!changes) continue;
		const oldRanges: CodeHighlightRange[] = [];
		const newRanges: CodeHighlightRange[] = [];
		let oldOffset = 0;
		let newOffset = 0;
		for (const change of changes) {
			if (change.removed)
				oldRanges.push({ start: oldOffset, end: oldOffset + change.value.length });
			if (change.added) newRanges.push({ start: newOffset, end: newOffset + change.value.length });
			if (!change.added) oldOffset += change.value.length;
			if (!change.removed) newOffset += change.value.length;
		}
		ranges.set(before, oldRanges);
		ranges.set(after, newRanges);
	}
	return ranges;
}
