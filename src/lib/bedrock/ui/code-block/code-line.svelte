<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import type { CodeLineData } from './highlight';
	import { codeLineParts, type CodeHighlightRange } from './line-parts';

	type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
		line: CodeLineData;
		/** Optional emphasis ranges, independent of syntax highlighting. */
		highlights?: readonly CodeHighlightRange[];
	};
	let { line, highlights = [], class: className, ...restProps }: Props = $props();
	const parts = $derived(codeLineParts(line, highlights));
</script>

<span data-slot="code-line" class={cn('line', className)} {...restProps}
	>{#if line.tokens || highlights.length}{#each parts as part, index (index)}<span
				data-slot={part.style ? 'code-token' : undefined}
				data-code-highlight={part.highlighted || undefined}
				class:code-token={!!part.style}
				class:code-highlight={part.highlighted}
				style={part.style}>{part.text}</span
			>{/each}{:else}{line.text}{/if}</span
>

<style>
	.code-highlight {
		background: var(--code-highlight-bg, color-mix(in oklch, var(--primary) 20%, transparent));
		border-radius: 2px;
	}
	.code-token {
		color: var(--shiki-light, inherit);
		font-style: var(--shiki-light-font-style, inherit);
		font-weight: var(--shiki-light-font-weight, inherit);
		text-decoration: var(--shiki-light-text-decoration, inherit);
	}
	:global(.dark) .code-token {
		color: var(--shiki-dark, inherit);
		font-style: var(--shiki-dark-font-style, inherit);
		font-weight: var(--shiki-dark-font-weight, inherit);
		text-decoration: var(--shiki-dark-text-decoration, inherit);
	}
</style>
