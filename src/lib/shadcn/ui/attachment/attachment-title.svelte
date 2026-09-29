<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();

	function attachRef(element: HTMLElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<span
	{@attach attachRef}
	data-slot="attachment-title"
	class={cn('attachment-title block max-w-full min-w-0 truncate font-medium', className)}
	{...restProps}
>
	{@render children?.()}
</span>

<style>
	.attachment-title {
		color: inherit;
	}
	:global([data-slot='attachment'][data-state='uploading']) .attachment-title,
	:global([data-slot='attachment'][data-state='processing']) .attachment-title {
		background-image: linear-gradient(
			100deg,
			currentColor 35%,
			var(--muted-foreground) 50%,
			currentColor 65%
		);
		background-size: 250% 100%;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: attachment-shimmer 2s linear infinite;
	}
	@keyframes attachment-shimmer {
		from {
			background-position: 100% 0;
		}
		to {
			background-position: -100% 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.attachment-title {
			animation: none !important;
		}
	}
	@media (forced-colors: active) {
		.attachment-title {
			-webkit-text-fill-color: currentColor !important;
			background: none !important;
		}
	}
</style>
