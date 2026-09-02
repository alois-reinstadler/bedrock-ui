<script lang="ts">
	import type { CitationSource } from '#lib/bedrock/ui/citation';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import MarkdownNode from './markdown-node.svelte';
	import { assignHeadingIds, collectCitationNumbers, lexMarkdown } from './markdown-utils.js';
	import type {
		MarkdownCitationStyle,
		MarkdownContext,
		MarkdownDensity,
		MarkdownHeadingLevel
	} from './types.js';

	/**
	 * Renders a markdown string through Bedrock components — never raw HTML.
	 * XSS-safe by construction: `html` tokens are rendered as escaped plain text,
	 * so consumer-provided markdown can never inject markup or scripts.
	 *
	 * Streaming: while `streaming` is true the content re-lexes on every update;
	 * block nodes are keyed by index so completed blocks do not remount, and
	 * nothing animates (streaming text never animates, no entry transitions).
	 * Flipping `streaming` back to false changes nothing else.
	 */
	export type MarkdownProps = Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> & {
		content: string;
		streaming?: boolean;
		sources?: Record<string, CitationSource>;
		citationStyle?: MarkdownCitationStyle;
		/** Document level `#` maps to; deeper headings clamp at 6. */
		headingLevelStart?: MarkdownHeadingLevel;
		/** Block spacing scale. */
		density?: MarkdownDensity;
		/** Return `false` to prevent navigation for that link. */
		onLinkClick?: (href: string, event: MouseEvent) => void | false;
	};

	let {
		ref = $bindable(null),
		class: className,
		content,
		streaming = false,
		sources = {},
		citationStyle = 'label',
		headingLevelStart = 1,
		density = 'default',
		onLinkClick,
		...restProps
	}: MarkdownProps = $props();

	const tokens = $derived(lexMarkdown(content));
	const context: MarkdownContext = $derived({
		sources,
		citationStyle,
		citationNumbers: collectCitationNumbers(tokens, sources),
		headingIds: assignHeadingIds(tokens),
		headingLevelStart,
		onLinkClick
	});
</script>

<div
	bind:this={ref}
	data-slot="markdown"
	data-streaming={streaming ? '' : undefined}
	aria-busy={streaming || undefined}
	class={cn(density === 'compact' ? 'space-y-2' : 'space-y-4', className)}
	{...restProps}
>
	<MarkdownNode {tokens} {context} />
</div>
