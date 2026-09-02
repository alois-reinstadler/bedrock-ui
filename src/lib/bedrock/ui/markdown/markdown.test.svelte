<script lang="ts">
	import type { CitationSource } from '#lib/bedrock/ui/citation';
	import Markdown from './markdown.svelte';
	import type { MarkdownHeadingLevel } from './types.js';

	let {
		content,
		sources = {},
		headingLevelStart = 1,
		onLinkClick
	}: {
		content: string;
		sources?: Record<string, CitationSource>;
		headingLevelStart?: MarkdownHeadingLevel;
		onLinkClick?: (href: string, event: MouseEvent) => void | false;
	} = $props();
</script>

<Markdown {content} {sources} {headingLevelStart} {onLinkClick} />
