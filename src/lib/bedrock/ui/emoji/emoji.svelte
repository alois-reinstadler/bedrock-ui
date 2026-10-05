<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';

	export type EmojiProps = Omit<
		WithElementRef<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
		'children'
	> & {
		/** One emoji or plain text containing emoji. Selection and copying preserve this text. */
		value: string;
		/** Optional accessible name. Omit to read the original text. */
		label?: string;
		/** Hide redundant content from assistive technology. */
		decorative?: boolean;
		/** Font size for the content: CSS length, or pixels when a number. Inherits by default. */
		size?: string | number;
	};
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { splitEmojiText } from './source';
	import Glyph from './emoji-glyph.svelte';

	let {
		ref = $bindable(null),
		value,
		label,
		decorative = false,
		size,
		style,
		...restProps
	}: EmojiProps = $props();
	const parts = $derived(splitEmojiText(value));
	const singleEmoji = $derived(parts.length === 1 && parts[0].emoji);
	const cssSize = $derived(typeof size === 'number' ? `${size}px` : size);
	function attachRef(element: HTMLSpanElement) {
		// Selected text can otherwise start a native drag with the artwork in its ghost.
		const preventDrag = (event: DragEvent) => event.preventDefault();
		element.addEventListener('dragstart', preventDrag);
		untrack(() => {
			ref = element;
		});
		return () => {
			element.removeEventListener('dragstart', preventDrag);
			if (ref === element) ref = null;
		};
	}
</script>

<span
	{...restProps}
	{@attach attachRef}
	data-slot="emoji"
	draggable="false"
	role={!decorative && (singleEmoji || label) ? 'img' : undefined}
	aria-label={decorative ? undefined : label || (singleEmoji ? value : undefined)}
	aria-hidden={decorative ? true : restProps['aria-hidden']}
	style={`${cssSize ? `font-size: ${cssSize};` : ''} ${style ?? ''}`}
	>{#each parts as part (part.index)}{#if part.emoji}<Glyph
				value={part.value}
			/>{:else}{part.value}{/if}{/each}</span
>
