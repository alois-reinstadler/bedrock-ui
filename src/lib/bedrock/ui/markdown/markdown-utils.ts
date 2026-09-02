import type { CitationSource } from '#lib/bedrock/ui/citation';
import { Lexer, type Token, type Tokens, type TokensList } from 'marked';
import type { MarkdownHeadingLevel, MarkdownOutlineItem } from './types.js';

/** Lexes markdown (GFM) into marked tokens. Lexer-only: nothing here ever produces HTML. */
export function lexMarkdown(content: string): TokensList {
	return Lexer.lex(content, { gfm: true });
}

/** Lowercases, turns every non-alphanumeric run into `-`, collapses and trims dashes. */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Returns a slugify wrapper that dedupes ids within one document:
 * repeated slugs get `-2`, `-3`, … suffixes in document order.
 */
export function createSlugger(): (text: string) => string {
	const seen = new Map<string, number>();
	return (text) => {
		const base = slugify(text) || 'section';
		const count = (seen.get(base) ?? 0) + 1;
		seen.set(base, count);
		return count === 1 ? base : `${base}-${count}`;
	};
}

/** Clamps `#` depth mapped through `headingLevelStart` at h6. */
export function clampHeadingLevel(
	depth: number,
	start: MarkdownHeadingLevel
): MarkdownHeadingLevel {
	return Math.min(depth - 1 + start, 6) as MarkdownHeadingLevel;
}

/** Walks tokens depth-first in document order, matching the renderer's traversal. */
function walk(tokens: Token[], visit: (token: Token) => void): void {
	for (const token of tokens) {
		visit(token);
		if (token.type === 'table') {
			const table = token as Tokens.Table;
			for (const cell of table.header) walk(cell.tokens, visit);
			for (const row of table.rows) for (const cell of row) walk(cell.tokens, visit);
		} else if (token.type === 'list') {
			for (const item of (token as Tokens.List).items) walk(item.tokens, visit);
		} else if ('tokens' in token && Array.isArray(token.tokens)) {
			walk(token.tokens, visit);
		}
	}
}

/** Flattens inline tokens to their plain-text content (used for slugs and outline labels). */
export function inlineTokensToPlainText(tokens: Token[] | undefined): string {
	if (!tokens) return '';
	let out = '';
	for (const token of tokens) {
		switch (token.type) {
			case 'text': {
				const text = token as Tokens.Text;
				out += text.tokens ? inlineTokensToPlainText(text.tokens) : text.text;
				break;
			}
			case 'escape':
			case 'codespan':
				out += (token as Tokens.Escape).text;
				break;
			case 'strong':
			case 'em':
			case 'del':
			case 'link':
				out += inlineTokensToPlainText((token as Tokens.Strong).tokens);
				break;
			case 'image':
				out += (token as Tokens.Image).text;
				break;
			case 'html':
				// Raw HTML is treated as literal text everywhere in this family.
				out += (token as Tokens.HTML).raw;
				break;
			case 'br':
				out += ' ';
				break;
		}
	}
	return out;
}

/** Assigns deduped slug ids to every heading token in document order. */
export function assignHeadingIds(tokens: Token[]): Map<Tokens.Heading, string> {
	const slug = createSlugger();
	const ids = new Map<Tokens.Heading, string>();
	walk(tokens, (token) => {
		if (token.type === 'heading') {
			const heading = token as Tokens.Heading;
			ids.set(heading, slug(inlineTokensToPlainText(heading.tokens)));
		}
	});
	return ids;
}

/**
 * Extracts the heading outline of a markdown string using the same lexer and
 * slug logic as the Markdown renderer, so Outline links always match rendered ids.
 */
export function outlineFromMarkdown(
	content: string,
	options: { headingLevelStart?: MarkdownHeadingLevel } = {}
): MarkdownOutlineItem[] {
	const { headingLevelStart = 1 } = options;
	const tokens = lexMarkdown(content);
	const ids = assignHeadingIds(tokens);
	const outline: MarkdownOutlineItem[] = [];
	walk(tokens, (token) => {
		if (token.type === 'heading') {
			const heading = token as Tokens.Heading;
			outline.push({
				id: ids.get(heading) ?? '',
				label: inlineTokensToPlainText(heading.tokens),
				level: clampHeadingLevel(heading.depth, headingLevelStart)
			});
		}
	});
	return outline;
}

export type CitationSegment = { type: 'text'; text: string } | { type: 'citation'; id: string };

const CITATION_PATTERN = /\[([^[\]\n]+)\]|【([^【】\n]+)】/g;

/**
 * Splits plain text into literal segments and citation markers. Only `[id]` /
 * `【id】` whose id matches a `sources` key become citations; everything else
 * stays literal text.
 */
export function splitCitations(
	text: string,
	sources: Record<string, CitationSource>
): CitationSegment[] {
	const segments: CitationSegment[] = [];
	let cursor = 0;
	for (const match of text.matchAll(CITATION_PATTERN)) {
		const id = match[1] ?? match[2];
		if (!Object.hasOwn(sources, id)) continue;
		if (match.index > cursor)
			segments.push({ type: 'text', text: text.slice(cursor, match.index) });
		segments.push({ type: 'citation', id });
		cursor = match.index + match[0].length;
	}
	if (cursor < text.length) segments.push({ type: 'text', text: text.slice(cursor) });
	return segments;
}

/**
 * Numbers citations 1-based by order of first appearance across the document,
 * walking leaf text tokens in the same order the renderer emits them.
 */
export function collectCitationNumbers(
	tokens: Token[],
	sources: Record<string, CitationSource>
): Map<string, number> {
	const numbers = new Map<string, number>();
	walk(tokens, (token) => {
		if (token.type !== 'text') return;
		const text = token as Tokens.Text;
		if (text.tokens) return;
		for (const segment of splitCitations(text.text, sources)) {
			if (segment.type === 'citation' && !numbers.has(segment.id)) {
				numbers.set(segment.id, numbers.size + 1);
			}
		}
	});
	return numbers;
}

/** True for absolute http(s) links pointing at a different origin than the current page. */
export function isExternalHref(href: string): boolean {
	if (!/^https?:\/\//i.test(href)) return false;
	if (typeof location === 'undefined') return true;
	try {
		return new URL(href, location.href).origin !== location.origin;
	} catch {
		return true;
	}
}
