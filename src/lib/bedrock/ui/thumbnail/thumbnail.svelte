<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const thumbnailVariants = tv({
		base: 'relative flex shrink-0 items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground',
		variants: {
			size: {
				sm: "size-8 *:[svg:not([class*='size-'])]:size-3.5",
				default: "size-10 *:[svg:not([class*='size-'])]:size-4",
				lg: "size-14 *:[svg:not([class*='size-'])]:size-5"
			},
			shape: {
				rounded: 'rounded-md',
				square: 'rounded-none'
			}
		},
		defaultVariants: { size: 'default', shape: 'rounded' }
	});

	export type ThumbnailSize = VariantProps<typeof thumbnailVariants>['size'];
	export type ThumbnailShape = VariantProps<typeof thumbnailVariants>['shape'];
</script>

<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		src,
		alt = '',
		size = 'default',
		shape = 'rounded',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
		src?: string | null;
		alt?: string;
		size?: ThumbnailSize;
		shape?: ThumbnailShape;
	} = $props();

	let failed = $state(false);
	$effect(() => {
		// A new source gets a fresh chance to load.
		void src;
		failed = false;
	});

	const showImage = $derived(Boolean(src) && !failed);
</script>

<span
	bind:this={ref}
	data-slot="thumbnail"
	class={cn(thumbnailVariants({ size, shape }), className)}
	{...restProps}
>
	{#if showImage}
		<img {src} {alt} class="size-full object-cover" onerror={() => (failed = true)} />
	{:else if children}
		{@render children()}
	{:else}
		<FileIcon aria-hidden="true" />
	{/if}
</span>
