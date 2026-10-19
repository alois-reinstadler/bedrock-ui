import type { CodeLineData, CodeToken } from './highlight';

/** UTF-16 offsets into the original line, with an exclusive end. */
export type CodeHighlightRange = { start: number; end: number };
export type CodeLinePart = CodeToken & { highlighted: boolean };

/** Overlay ranges without discarding token styles or changing source text. */
export function codeLineParts(
	line: CodeLineData,
	ranges: readonly CodeHighlightRange[]
): CodeLinePart[] {
	const normalized = ranges
		.filter(({ start, end }) => Number.isFinite(start) && Number.isFinite(end) && end > start)
		.map(({ start, end }) => ({
			start: Math.max(0, Math.floor(start)),
			end: Math.min(line.text.length, Math.floor(end))
		}));
	let offset = 0;
	return (line.tokens ?? [{ text: line.text }]).flatMap((token) => {
		const start = offset;
		const end = (offset += token.text.length);
		const boundaries = [
			...new Set([
				start,
				end,
				...normalized
					.flatMap((range) => [range.start, range.end])
					.filter((point) => point > start && point < end)
			])
		].sort((a, b) => a - b);
		return boundaries.slice(0, -1).map((point, index) => ({
			text: token.text.slice(point - start, boundaries[index + 1] - start),
			style: token.style,
			highlighted: normalized.some((range) => point >= range.start && point < range.end)
		}));
	});
}
