<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import { createAttachmentKey } from 'svelte/attachments';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		type = 'button',
		child,
		...restProps
	}: WithElementRef<HTMLButtonAttributes> & {
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const refKey = createAttachmentKey();
	function attachRef(element: HTMLElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
	const mergedProps = $derived({
		[refKey]: attachRef,
		class: cn(
			'absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none',
			className
		),
		'data-slot': 'attachment-trigger',
		...restProps
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {type} {...mergedProps}>
		{@render mergedProps.children?.()}
	</button>
{/if}
