import type { CitationSource } from '#lib/bedrock/ui/citation';
import type { Tokens } from 'marked';

export type MarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type MarkdownCitationStyle = 'label' | 'number';
export type MarkdownDensity = 'default' | 'compact';

/** One entry of a document outline; consumed directly by the Outline component. */
export type MarkdownOutlineItem = { id: string; label: string; level: number };

/**
 * Render context threaded through the recursive token renderer.
 * Citation numbers and heading ids are precomputed once per document so every
 * node renders consistently regardless of nesting.
 */
export type MarkdownContext = {
	sources: Record<string, CitationSource>;
	citationStyle: MarkdownCitationStyle;
	/** 1-based citation numbers in order of first appearance across the document. */
	citationNumbers: ReadonlyMap<string, number>;
	/** Deduped slug ids assigned per heading token in document order. */
	headingIds: ReadonlyMap<Tokens.Heading, string>;
	headingLevelStart: MarkdownHeadingLevel;
	onLinkClick?: (href: string, event: MouseEvent) => void | false;
};
