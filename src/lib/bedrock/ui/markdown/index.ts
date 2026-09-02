import Root from './markdown.svelte';

export type { MarkdownProps } from './markdown.svelte';
export { outlineFromMarkdown, slugify } from './markdown-utils.js';
export type {
	MarkdownCitationStyle,
	MarkdownDensity,
	MarkdownHeadingLevel,
	MarkdownOutlineItem
} from './types.js';

export {
	Root,
	//
	Root as Markdown
};
